from fastapi import APIRouter, Query, HTTPException, WebSocket, WebSocketDisconnect
import random
import json
import base64
import tempfile
import os
from services.supabase_service import get_questions
from groq import Groq
from config.prompts import ACTIVE_INTERVIEWER_PROMPT

router = APIRouter()
groq_client = Groq()

# --- Fix 3: Small fast model for live conversation, big model only for evaluator ---
LIVE_MODEL = "llama-3.1-8b-instant"
# Max conversation turns to keep in memory (Fix 2)
MAX_TURNS_IN_MEMORY = 6

def trim_session_memory(memory: list) -> list:
    """Keep system message + last MAX_TURNS_IN_MEMORY messages only (Fix 2)."""
    if len(memory) <= MAX_TURNS_IN_MEMORY + 1:
        return memory
    system_msg = memory[0]
    recent = memory[-(MAX_TURNS_IN_MEMORY):]
    return [system_msg] + recent

def summarize_vision(vision_log) -> str:
    """Convert full vision JSON to a 1-line summary to save tokens (Fix 4)."""
    if not vision_log:
        return "attention: ok"
    try:
        if isinstance(vision_log, list) and len(vision_log) > 0:
            last = vision_log[-1] if vision_log else {}
        else:
            last = vision_log if isinstance(vision_log, dict) else {}
        
        gaze = last.get("gaze_direction", "forward")
        attention = last.get("attention", "ok")
        flags = last.get("flags", [])
        flag_str = ", ".join(flags) if flags else "none"
        return f"attention: {attention}, gaze: {gaze}, flags: {flag_str}"
    except Exception:
        return "attention: ok"


@router.get("/api/questions")
async def fetch_questions(
    company_name: str = Query(...),
    round_type: str = Query(...),
    difficulty: str = Query(...)
):
    try:
        if difficulty == "Mixed":
            easy = get_questions(company_name, round_type, "Easy") or []
            medium = get_questions(company_name, round_type, "Medium") or []
            hard = get_questions(company_name, round_type, "Hard") or []
            selected = random.sample(easy, min(len(easy), 5)) + \
                       random.sample(medium, min(len(medium), 10)) + \
                       random.sample(hard, min(len(hard), 5))
        else:
            all_q = get_questions(company_name, round_type, difficulty) or []
            selected = random.sample(all_q, min(len(all_q), 20))
            
        random.shuffle(selected)
        return selected
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.websocket("/ws/interview")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    session_memory = []
    session_questions = []   # Fix 1: only 5 questions stored server-side

    try:
        while True:
            raw_data = await websocket.receive_text()
            data = json.loads(raw_data)

            # ---------------------------------------------------------------
            # INIT: Build system prompt once, store trimmed questions server-side
            # ---------------------------------------------------------------
            if data.get("type") == "init":
                config = data.get("config", {})
                company_name = config.get("company", "this company")
                student_name = config.get("student_name", "there")
                time_limit = config.get("time_limit_minutes", 45)
                round_type = config.get("round_type", "")
                all_questions = config.get("questions", [])

                # Fix 1: Select only 5 questions for the session
                max_q = 5
                session_questions = all_questions[:max_q] if len(all_questions) >= max_q else all_questions
                
                # Pick first question for introduction
                first_question_text = session_questions[0].get("primary_question", "") if session_questions else ""

                # Hydrate the prompt with dynamic values
                hydrated_prompt = ACTIVE_INTERVIEWER_PROMPT \
                    .replace("{COMPANY_NAME}", company_name) \
                    .replace("{TIME_LIMIT_MINUTES}", str(time_limit)) \
                    .replace("{STUDENT_NAME}", student_name) \
                    .replace("{FIRST_QUESTION_TEXT}", first_question_text)

                # Fix 1: Only include question text + concepts, no full metadata, no indent
                slim_questions = []
                for i, q in enumerate(session_questions):
                    slim_questions.append({
                        "q": i + 1,
                        "question": q.get("primary_question", ""),
                        "concepts": q.get("expected_concepts", []),
                        "difficulty": q.get("difficulty", "")
                    })

                system_content = (
                    f"{hydrated_prompt}\n\n"
                    f"--- SESSION CONTEXT ---\n"
                    f"Company: {company_name} | Round: {round_type} | Time: {time_limit} min | Student: {student_name}\n"
                    f"Your question plan (internal only — never reveal concepts to student):\n"
                    f"{json.dumps(slim_questions)}"
                )

                session_memory = [{"role": "system", "content": system_content}]

            # ---------------------------------------------------------------
            # USER TURN: Transcribe, trim context, call LLM
            # ---------------------------------------------------------------
            elif data.get("type") == "user_turn":
                audio_b64 = data.get("audio_base64")
                vision_log = data.get("vision_log")
                user_transcript = ""

                # Transcribe audio via Whisper
                if audio_b64:
                    audio_data = base64.b64decode(audio_b64)
                    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp_audio:
                        temp_audio.write(audio_data)
                        temp_audio_path = temp_audio.name

                    try:
                        with open(temp_audio_path, "rb") as f:
                            transcription = groq_client.audio.transcriptions.create(
                                file=(os.path.basename(temp_audio_path), f.read()),
                                model="whisper-large-v3-turbo",
                            )
                        user_transcript = transcription.text
                    except Exception as e:
                        print(f"STT Error: {e}")
                        user_transcript = "(Inaudible due to transcription error)"
                    finally:
                        if os.path.exists(temp_audio_path):
                            os.remove(temp_audio_path)

                if not user_transcript.strip():
                    user_transcript = "(Silence)"

                # Fix 4: Replace full vision JSON with 1-line summary
                vision_summary = summarize_vision(vision_log)

                # Append user message (slim format)
                session_memory.append({
                    "role": "user",
                    "content": f"[Vision: {vision_summary}]\nStudent: {user_transcript}"
                })

                # Fix 2: Trim to keep system + last MAX_TURNS_IN_MEMORY messages
                session_memory = trim_session_memory(session_memory)

                # Fix 3: Use fast 8B model for live conversation
                try:
                    chat_completion = groq_client.chat.completions.create(
                        messages=session_memory,
                        model=LIVE_MODEL,
                        temperature=0.7,
                        max_tokens=200
                    )
                    ai_response = chat_completion.choices[0].message.content
                except Exception as e:
                    print(f"LLM Error: {e}")
                    ai_response = "I had a brief connection issue — could you repeat that last point?"

                session_memory.append({"role": "assistant", "content": ai_response})

                await websocket.send_text(json.dumps({
                    "type": "ai_response",
                    "ai_text": ai_response,
                    "user_transcript": user_transcript,
                    "timestamp": "00:00"
                }))

    except WebSocketDisconnect:
        print("Client disconnected from websocket")
    except Exception as e:
        print(f"Websocket error: {e}")
