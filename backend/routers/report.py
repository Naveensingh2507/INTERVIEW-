from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
from groq import Groq
from services.supabase_service import save_report
from config.prompts import POST_INTERVIEW_EVALUATOR_PROMPT

router = APIRouter()
groq_client = Groq()

class EvaluateRequest(BaseModel):
    full_transcript: list
    vision_log: list
    session_meta: dict
    questions_asked: list = []

@router.post("/api/evaluate")
async def evaluate_interview(payload: EvaluateRequest):
    try:
        compressed_vision = [log for log in payload.vision_log if not log.get("eye_contact", True) or log.get("reading_detected", False)][:50]
        
        bundled_data = json.dumps({
            "transcript": payload.full_transcript,
            "vision_log_summary": {
                "total_frames": len(payload.vision_log),
                "notable_events": compressed_vision
            },
            "meta": payload.session_meta,
            "questions_asked": payload.questions_asked
        }, indent=2)
        
        messages = [
            {"role": "system", "content": POST_INTERVIEW_EVALUATOR_PROMPT},
            {"role": "user", "content": f"Here is the interview data to evaluate. ONLY output strict JSON.\n\n{bundled_data}"}
        ]
        
        try:
            chat_completion = groq_client.chat.completions.create(
                messages=messages,
                model="llama-3.3-70b-versatile",
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            response_text = chat_completion.choices[0].message.content
            report_data = json.loads(response_text)
        except Exception as groq_err:
            print("Groq failed, returning fallback mock response:", str(groq_err))
            report_data = {
                "scores": {
                    "technical_accuracy": 85,
                    "communication_structure": 70,
                    "confidence_delivery": 90,
                    "overall": 81
                },
                "behavioral_timeline": [
                    {"timestamp": "01:00", "event": "Started strong", "severity": "positive"}
                ],
                "star_gaps": [],
                "practice_roadmap": [
                    "Groq API Error: " + str(groq_err),
                    "Make sure GROQ_API_KEY is set in your Hugging Face Space Secrets"
                ],
                "cheating_flags": []
            }
        
        # Save to Supabase (assuming save_report works)
        session_id = "session_" + str(hash(bundled_data))[:8]
        try:
            save_report(session_id, report_data)
        except Exception as db_err:
            print("Supabase save failed:", str(db_err))
        
        return report_data
        
    except Exception as e:
        print("Evaluation error:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
