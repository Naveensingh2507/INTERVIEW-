# HIREVAULT — Phase-by-Phase Build Prompts
> Copy-paste each phase prompt directly into Claude (or your AI coding tool). Complete one phase fully before moving to the next.

---

## CONTEXT BLOCK
> Paste this at the top of EVERY new conversation before any phase prompt. It keeps the AI aligned on what you're building.

```
I am building a web app called HIREVAULT — an AI-powered interview prep and resume auditing platform for college students in India.

It has two core features:

1. AI RESUME AUDITOR: User uploads resume + pastes a Job Description → gets an ATS score out of 100 with line-by-line corrective suggestions in a clean UI.

2. AI MOCK INTERVIEWER: Real-time voice + video interview simulator. Uses WebRTC for audio, MediaPipe for webcam tracking (eye contact, posture, anti-cheat), Groq Whisper for STT, Groq LLaMA for conversation, and Groq TTS for the AI interviewer's voice. Has a split-screen layout: left side = AI voice waveform visualizer, right side = whiteboard code editor. Ends with a full JSON evaluation report.

Tech stack: Next.js (frontend), FastAPI (Python backend), Supabase (PostgreSQL database), Groq API (LLM + STT + TTS), MediaPipe (webcam vision).

DO NOT write actual text for the three system prompts yet. Leave clearly labeled placeholders:
- RESUME_AUDITOR_PROMPT
- ACTIVE_INTERVIEWER_PROMPT  
- POST_INTERVIEW_EVALUATOR_PROMPT

DO NOT add a live code compiler or code execution sandbox. The whiteboard is a static text editor only.

Do not start writing code until I confirm the plan looks correct.
```

---

## PHASE 1 — Project Scaffold & Folder Structure

> Goal: Get the full project folder structure set up with all config files, environment variable placeholders, and package installations. Nothing should be functional yet — just the skeleton.

```
[PASTE CONTEXT BLOCK ABOVE FIRST]

PHASE 1 TASK: Project Scaffold

Create the complete folder and file structure for HIREVAULT. Do not write any logic yet — just the skeleton with placeholder comments.

Required structure:

FRONTEND (Next.js + Tailwind CSS):
- /app or /pages routing
- /components folder with empty component files for:
  - ResumeUploader.jsx
  - ATSScoreDashboard.jsx
  - CorrectionCard.jsx (the before/after feedback card)
  - InterviewSetup.jsx
  - InterviewRoom.jsx (the main split-screen)
  - WaveVisualizer.jsx (the audio waveform, not a 3D avatar)
  - WhiteboardEditor.jsx (static Monaco-style code text area)
  - PostInterviewReport.jsx
- /lib folder for:
  - groqClient.js (Groq API connection placeholder)
  - supabaseClient.js (Supabase connection placeholder)
  - vadController.js (WebRTC VAD placeholder)
  - mediapipeController.js (MediaPipe + OpenCV vision placeholder)
- /config folder for:
  - prompts.js — export three empty string constants: RESUME_AUDITOR_PROMPT, ACTIVE_INTERVIEWER_PROMPT, POST_INTERVIEW_EVALUATOR_PROMPT
  - audioFillers.js — export array of pre-loaded 1-second filler strings: ["Hmm, okay...", "Got it...", "I see..."]
- .env.local file with these placeholder keys (no real values):
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  GROQ_API_KEY=

BACKEND (FastAPI + Python):
- /main.py — FastAPI app entry point
- /routers/ folder with:
  - resume.py (route: POST /api/audit)
  - interview.py (route: WebSocket /ws/interview)
  - report.py (route: POST /api/evaluate)
- /services/ folder with:
  - pdf_parser.py (pdfplumber text extraction placeholder)
  - groq_service.py (Groq API calls placeholder)
  - supabase_service.py (question bank query placeholder)
  - vision_log_processor.py (MediaPipe JSON log ingestion placeholder)
- /config/ folder with:
  - prompts.py — three empty string variables: RESUME_AUDITOR_PROMPT, ACTIVE_INTERVIEWER_PROMPT, POST_INTERVIEW_EVALUATOR_PROMPT
- requirements.txt with all needed packages:
  fastapi, uvicorn, pdfplumber, python-dotenv, groq, supabase, python-multipart
- .env file with placeholder keys:
  GROQ_API_KEY=
  SUPABASE_URL=
  SUPABASE_KEY=

After generating the structure, list every file created and confirm zero logic has been written yet.
```

---

## PHASE 2 — Supabase Database Setup

> Goal: Create the Supabase question bank table and the user reports table. Get the connection working from the backend.

```
[PASTE CONTEXT BLOCK ABOVE FIRST]

PHASE 2 TASK: Supabase Database Schema + Connection

STEP A — Write the SQL to run inside the Supabase SQL Editor:

Create this exact table for the question bank:

CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    role TEXT NOT NULL,
    round_type TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    primary_question TEXT NOT NULL,
    expected_concepts JSONB NOT NULL
);

Also create this table to store completed interview reports per user session:

CREATE TABLE interview_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    company_name TEXT,
    role TEXT,
    round_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    transcript JSONB,
    vision_log JSONB,
    final_report JSONB
);

Also create this table to store resume audit results:

CREATE TABLE resume_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    raw_resume_text TEXT,
    job_description TEXT,
    audit_result JSONB
);

STEP B — Write the Supabase client connection code:

In /services/supabase_service.py (Python/FastAPI backend):
- Connect using SUPABASE_URL and SUPABASE_KEY from .env
- Write a function: get_questions(company_name, round_type, difficulty) that queries the questions table and returns a list of question objects
- Write a function: save_report(session_id, report_data) that inserts into interview_reports

In /lib/supabaseClient.js (Next.js frontend):
- Connect using NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
- Export the client for use in components

Do not populate any data yet. Just make the connection and query functions work.
```

---

## PHASE 3 — Resume Auditor Backend

> Goal: Build the working backend pipeline for the Resume Auditor — PDF parsing → LLM call → return structured JSON.

```
[PASTE CONTEXT BLOCK ABOVE FIRST]

PHASE 3 TASK: Resume Auditor — Backend Pipeline

Build the complete backend logic for the AI Resume Auditor. The flow is:
User uploads PDF + pastes Job Description → backend parses PDF → calls Groq LLM with RESUME_AUDITOR_PROMPT → returns strict JSON.

STEP A — PDF Parser (/services/pdf_parser.py):
- Use pdfplumber to extract raw text from an uploaded PDF file
- Handle multi-column resume layouts (do not merge columns into one broken line)
- Return the clean extracted text as a plain string
- Handle errors gracefully: if PDF is unreadable, return a clear error message

STEP B — Groq LLM Call (/services/groq_service.py):
- Write a function: audit_resume(resume_text, job_description)
- It should call the Groq API using the RESUME_AUDITOR_PROMPT from /config/prompts.py
- Use model: llama3-70b-8192 (or the best available Groq LLM)
- The user message to the LLM must inject resume_text and job_description clearly labeled
- Return the raw JSON string from Groq's response

STEP C — API Route (/routers/resume.py):
- POST /api/audit endpoint
- Accepts: multipart form with a PDF file upload + a text field for job_description
- Calls pdf_parser → groq_service in sequence
- Parses the returned JSON string into a Python dict
- Returns the dict as the API response
- If JSON parsing fails (LLM gave non-JSON), return a 500 error with a clear message

IMPORTANT: Leave RESUME_AUDITOR_PROMPT as an empty string placeholder in /config/prompts.py. Add a comment: # FILL THIS WITH THE RESUME AUDITOR SYSTEM PROMPT BEFORE TESTING

The expected JSON structure the LLM must eventually return (for reference only — do not hardcode this):
{
  "ats_score": 78,
  "score_breakdown": {
    "keyword_match": 32,
    "impact_and_metrics": 22,
    "formatting": 14,
    "core_fundamentals": 10
  },
  "missing_keywords": ["Docker", "CI/CD", "REST APIs"],
  "corrections": [
    {
      "original_line": "Helped team build a database",
      "issue": "Weak action verb, no metrics, missing STAR format",
      "suggested_fix": "Optimized PostgreSQL database schema, reducing query latency by 30% for 5,000+ active users"
    }
  ]
}
```

---

## PHASE 4 — Resume Auditor Frontend

> Goal: Build the complete UI for the Resume Auditor — upload screen → loading state → results dashboard.

```
[PASTE CONTEXT BLOCK ABOVE FIRST]

PHASE 4 TASK: Resume Auditor — Frontend UI

Build the full frontend flow for the Resume Auditor using Next.js + Tailwind CSS. Dark mode. Clean "developer tool" aesthetic — think Vercel/Linear styling. No clutter.

SCREEN 1 — Input Page (/app/audit/page.jsx or /pages/audit.js):
- Centered split-card layout (two cards side by side on desktop, stacked on mobile)
- Left card: Drag-and-drop zone for PDF upload. Show file name once uploaded.
- Right card: Large textarea for pasting the Job Description
- Below both cards: A single primary CTA button — "Generate ATS Audit"
- On click: show a full-page loading spinner with text "Auditing your resume..."
- On success: navigate to the Results page passing the JSON response as state (or store in sessionStorage)

SCREEN 2 — Results Dashboard (/app/audit/results/page.jsx):
- Top: A large circular progress ring showing ats_score out of 100. Animate it filling up on page load.
- Below the ring: Four smaller metric cards in a row showing score_breakdown values:
  - Keyword Match (out of 40)
  - Impact & Metrics (out of 30)
  - Formatting (out of 20)
  - Core Fundamentals (out of 10)
- Missing Keywords section: A row of red badge chips listing each item in missing_keywords
- Corrections Feed (main body): A vertical scrollable list of CorrectionCard components
  - Each CorrectionCard has two halves:
    - Top half (red left border): original_line + issue label
    - Bottom half (green left border): suggested_fix with a subtle "copy" icon button
- All data comes from parsing the JSON returned by the /api/audit backend endpoint

Build ResumeUploader.jsx, ATSScoreDashboard.jsx, and CorrectionCard.jsx as separate reusable components.
```

---

## PHASE 5 — Interview Setup & Question Bank Integration

> Goal: Build the interview setup screen and wire it to Supabase to fetch the right questions.

```
[PASTE CONTEXT BLOCK ABOVE FIRST]

PHASE 5 TASK: Interview Setup Screen + Question Bank Query

FRONTEND — InterviewSetup.jsx:
- Clean centered form page. Title: "Prepare Your Interview"
- Dropdown 1: Company — options: [Google, Amazon, TCS] (the 3 companies in our database)
- Dropdown 2: Role — options: [SDE-1] (can expand later)
- Dropdown 3: Round Type — options: [HR / Behavioral, DSA & Problem Solving, Machine Coding, Core CS Fundamentals]
- Dropdown 4: Difficulty — options: [Easy, Medium, Hard, Mixed]
- Dropdown 5: Time Limit — options: [30 minutes, 45 minutes, 60 minutes]
- Primary CTA button: "Start Interview"
- On click: show a full-page skeleton loading screen with animated text cycling through:
  "Selecting your questions...", "Preparing your interviewer...", "Almost ready..."
  (This masks the backend fetching questions from Supabase — minimum 2 seconds even if fast)
- Pass selected options + fetched questions as state to the InterviewRoom component

BACKEND — /routers/interview.py:
- GET /api/questions endpoint
- Accepts query params: company_name, round_type, difficulty
- Calls supabase_service.get_questions() with those params
- If difficulty = "Mixed": fetch a mix of 5 Easy + 10 Medium + 5 Hard from Supabase
- Otherwise: fetch 20 questions matching the exact difficulty
- Shuffle the returned questions randomly before sending
- Return the list as JSON

The frontend calls this endpoint when the user clicks "Start Interview", during the loading skeleton screen.
```

---

## PHASE 6 — Live Interview Room (Core Engine)

> Goal: Build the real-time interview room — the most complex part. Split screen, VAD, MediaPipe, Groq pipeline.

```
[PASTE CONTEXT BLOCK ABOVE FIRST]

PHASE 6 TASK: Live Interview Room — Real-Time Pipeline

This is the most complex phase. Build the InterviewRoom component and all its supporting systems.

--- FRONTEND LAYOUT (InterviewRoom.jsx) ---

Split-screen layout (50/50 on desktop):

LEFT PANEL — AI Interviewer:
- Center: WaveVisualizer component — a dynamic SVG/Canvas audio waveform. It has 4 distinct visual states:
  1. IDLE: Flat, calm horizontal line with slow gentle pulse
  2. LISTENING: Reacts in real-time to the user's microphone input level (use Web Audio API AnalyserNode)
  3. THINKING: Glowing color-shift animation (plays when VAD triggers and filler audio fires)
  4. SPEAKING: Pulses fast in sync with TTS audio output
- Below wave: Status text — cycles between "Interviewer is listening...", "Interviewer is thinking...", "Interviewer is speaking..."
- Bottom-left corner: Small floating PIP (Picture-in-Picture) box showing the user's webcam feed so they know they're being monitored
- Floating timer (top of left panel): Shows remaining time in MM:SS, counting down from user's selected time limit

RIGHT PANEL — Technical Whiteboard:
- Clean code editor (use a textarea styled with monospace font, or integrate react-simple-code-editor with Prism for syntax highlighting)
- Title: "Whiteboard — Type your code or pseudocode here"
- The whiteboard is hidden by default. It slides in when AI asks a coding question.
- A button: "Open Whiteboard" which the student or AI can trigger
- When whiteboard is open: `is_coding_active = true` (React state)

--- MEDIAPIPE VISION LOGIC (mediapipeController.js) ---

- Initialize MediaPipe FaceMesh via CDN
- CRITICAL: Hard cap webcam frame sampling at MAX 3 FPS using setInterval, not requestAnimationFrame (which runs at 60fps). This prevents the "Melted Laptop" issue.
- Track eye landmarks to determine gaze direction
- Log gaze events into a local array: vision_log = [{timestamp, eye_contact, posture, suspicious_movement}]
- Context-Aware Logic:
  - If is_coding_active === false: flag sustained gaze away from center as "eye_contact: poor"
  - If is_coding_active === true: whitelist gaze to the RIGHT quadrant of screen (whiteboard side). Do NOT flag this as cheating.
  - ALWAYS active regardless of is_coding_active: detect "typewriter effect" — rapid repetitive horizontal eye micro-movements (indicates reading from a script). Flag these as "reading_detected: true"

--- AUDIO PIPELINE (vadController.js) ---

- Request microphone access
- Apply browser-native noise suppression: { noiseSuppression: true, echoCancellation: true }
- Implement Voice Activity Detection:
  - Use Web Audio API to monitor audio volume levels
  - If volume drops below threshold for 500-700ms continuously → trigger "end of turn"
  - On "end of turn" trigger:
    1. Lock and capture the audio chunk
    2. Immediately play a random pre-loaded audio filler from audioFillers.js ("Hmm, okay...", "Got it...")
    3. Set WaveVisualizer state to THINKING
    4. Send audio chunk + current vision_log snapshot to backend WebSocket

--- BACKEND WEBSOCKET (/routers/interview.py WebSocket /ws/interview) ---

- On connection: receive session config (company, role, round_type, questions list, time_limit)
- Store ACTIVE_INTERVIEWER_PROMPT + questions in session memory
- On receive audio chunk:
  1. Call Groq Whisper (whisper-large-v3-turbo) to transcribe → get text transcript
  2. Append transcript turn to conversation history
  3. Attach the vision_log JSON from this turn to the conversation context
  4. Send full conversation history + current question context to Groq LLaMA using ACTIVE_INTERVIEWER_PROMPT
  5. STREAM the LLM response token-by-token back to the frontend via WebSocket
  6. Frontend receives streamed text and pipes it sentence-by-sentence to a TTS call (Groq TTS or browser SpeechSynthesis as fallback)
  7. WaveVisualizer switches to SPEAKING state while TTS plays

LEAVE ACTIVE_INTERVIEWER_PROMPT as a placeholder string in /config/prompts.py with comment:
# FILL: This prompt must instruct the LLM to act as a technical interviewer, manage the time budget, ask primary questions from the provided list, ask 1-2 follow-up "branch" questions based on student answers, handle clarification mode if student asks a reverse question, and NEVER output scores, JSON, or markdown during the live session.
```

---

## PHASE 7 — Post-Interview Report

> Goal: When the interview ends, trigger the evaluator and display the final HireReady report.

```
[PASTE CONTEXT BLOCK ABOVE FIRST]

PHASE 7 TASK: Post-Interview Evaluator + Report UI

--- BACKEND (/routers/report.py — POST /api/evaluate) ---

Triggered when user clicks "End Interview" or the countdown timer hits zero.

Receives:
- full_transcript: array of {role, content, timestamp} objects
- vision_log: full array of {timestamp, eye_contact, posture, reading_detected} objects
- session_meta: {company_name, role, round_type, time_limit_used}

Process:
1. Bundle everything into one large payload
2. Send to Groq LLaMA using POST_INTERVIEW_EVALUATOR_PROMPT
3. Parse the returned JSON string
4. Save to Supabase interview_reports table via supabase_service.save_report()
5. Return the parsed JSON to the frontend

LEAVE POST_INTERVIEW_EVALUATOR_PROMPT as a placeholder with this comment:
# FILL: This prompt must instruct the LLM to act as a Senior Technical Assessor. It receives the full interview transcript + vision logs. It must output STRICT JSON ONLY with this structure:
# {
#   "scores": {
#     "technical_accuracy": 0-100,
#     "communication_structure": 0-100,
#     "confidence_delivery": 0-100,
#     "overall": 0-100
#   },
#   "behavioral_timeline": [
#     {"timestamp": "04:12", "event": "Rambling detected — word pace increased 40%", "severity": "warning"},
#     {"timestamp": "12:45", "event": "Correctly stated Big-O complexity before writing code", "severity": "positive"}
#   ],
#   "star_gaps": [
#     {"question": "Tell me about a challenge...", "missing_component": "Result", "feedback": "You described the Situation and Action well but forgot to state what the outcome was."}
#   ],
#   "practice_roadmap": [
#     "Practice 3 Two-Pointer style DSA problems",
#     "Work on concise STAR Result statements — keep them under 30 seconds"
#   ],
#   "cheating_flags": [
#     {"timestamp": "07:30", "type": "reading_detected", "note": "Horizontal eye scanning detected for 8 seconds"}
#   ]
# }

--- FRONTEND (PostInterviewReport.jsx) ---

Full-page results screen. Title: "Your HireReady Report"

Section 1 — Score Cards (top row, 4 cards):
- Technical Accuracy / 100
- Communication & Structure / 100
- Confidence & Delivery / 100
- Overall Score / 100
- Each card animates counting up to its value on load

Section 2 — Behavioral Timeline:
- Visual horizontal timeline bar (like a video progress bar)
- Red markers for "warning" events, green markers for "positive" events
- Clicking a marker shows a tooltip with the event description and timestamp

Section 3 — STAR Gap Finder:
- List of cards, one per STAR gap detected
- Shows which question triggered it, which letter was missing, and the AI's specific feedback

Section 4 — Practice Roadmap:
- Clean numbered checklist of 2-3 items from practice_roadmap array

Section 5 — Cheating/Integrity Flags (if any):
- Only show this section if cheating_flags array is non-empty
- Yellow warning card listing the timestamps and types of flags detected

Add a "Download Report" button that exports the JSON as a formatted PDF (use browser print or jsPDF).
Add a "Practice Again" button that routes back to InterviewSetup.
```

---

## PHASE 8 — Navigation, Auth & Polish

> Goal: Wire everything together, add basic auth, and polish the UI into a shippable prototype.

```
[PASTE CONTEXT BLOCK ABOVE FIRST]

PHASE 8 TASK: Navigation, Auth, and Final Polish

NAVIGATION:
- Build a clean top navbar with: Logo ("HIREVAULT" in bold), nav links: "Resume Audit" | "Mock Interview", a user avatar/login button on the right
- Build a homepage (/) with two large CTA cards:
  - Card 1: "AI Resume Auditor" — subtitle + button → routes to /audit
  - Card 2: "AI Mock Interviewer" — subtitle + button → routes to /interview/setup
- Use Next.js App Router or Pages Router consistently throughout

AUTH (Supabase Auth — keep it simple):
- Email + Password signup/login only for the prototype (no OAuth for now)
- Use Supabase's built-in auth
- Protect these routes (redirect to /login if not authenticated):
  - /audit/results
  - /interview/room
  - /interview/report
- Store the logged-in user's ID on interview_reports and resume_audits so each user only sees their own data
- Add a basic /dashboard page showing the user's last 3 audits and last 3 interview scores from Supabase

POLISH CHECKLIST:
- Dark mode throughout (background: #0a0a0a, cards: #111, accents: indigo or violet)
- All loading states have skeleton screens or spinners — no blank white pages ever
- All API errors show a clean toast notification, not a raw browser error
- The whiteboard editor in the interview room uses monospace font (JetBrains Mono or Fira Code via Google Fonts)
- The WaveVisualizer is smooth and uses CSS transitions between states
- Mobile responsiveness: the interview room stacks vertically on screens under 768px (waveform on top, whiteboard below)
- Add a favicon and page titles for each route

FINAL CHECK:
Once this phase is complete, list every route in the app, every API endpoint, and every Supabase table. Confirm everything is connected end-to-end.
```

---

## REFERENCE: What to Fill In Later (Placeholders)

These are the three things deliberately left empty throughout all phases. Fill these in once the app skeleton is running.

### 1. `RESUME_AUDITOR_PROMPT`
File: `/config/prompts.py` (backend) and `/config/prompts.js` (frontend reference)

This prompt must make the LLM:
- Act as a ruthless FAANG recruiter
- Accept two inputs labeled clearly: [RESUME TEXT] and [JOB DESCRIPTION]
- Output STRICT JSON ONLY — no conversational text
- Score across 4 buckets: keyword_match (40pts), impact_and_metrics (30pts), formatting (20pts), core_fundamentals (10pts)
- Give line-by-line corrections with original_line, issue, and suggested_fix
- Never invent skills not in the resume

### 2. `ACTIVE_INTERVIEWER_PROMPT`
File: `/config/prompts.py`

This prompt must make the LLM:
- Act as a specific company's technical interviewer (inject company name dynamically)
- Receive the question bank list and time budget at session start
- Ask primary questions from the provided list ("Trunk")
- Ask 1-2 follow-up questions based on the student's actual answer ("Branch")
- Monitor conversation length to manage pacing — fewer follow-ups when time is short
- Enter "Clarification Mode" if student asks a reverse question — briefly answer then redirect
- Output SHORT plain-text conversational sentences ONLY. No JSON, no scores, no markdown during the live session.

### 3. `POST_INTERVIEW_EVALUATOR_PROMPT`
File: `/config/prompts.py`

This prompt must make the LLM:
- Act as a Senior Technical Assessor receiving a complete transcript + vision log
- Evaluate against: STAR method (HR), Big-O notation mention (DSA), communication fluency, confidence data from vision logs
- Output STRICT JSON ONLY using the schema defined in Phase 7
- Give a behavioral timeline with timestamps
- Identify STAR gaps with specific missing components
- Generate 2-3 targeted practice recommendations
- Flag any cheating events from the vision log

### 4. Supabase API Keys
Add to `.env` (backend) and `.env.local` (frontend):
```
SUPABASE_URL=your_project_url_here
SUPABASE_KEY=your_anon_or_service_key_here
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 5. Groq API Key
Add to `.env` (backend):
```
GROQ_API_KEY=your_groq_key_here
```

---

## QUICK REFERENCE: Architecture Summary

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js + Tailwind CSS | UI, routing, webcam, audio |
| Vision Engine | MediaPipe FaceMesh (3 FPS max) | Eye tracking, anti-cheat |
| Audio | WebRTC VAD + Groq Whisper | Speech-to-text, noise suppression |
| LLM | Groq LLaMA 3 | Interviewer brain + evaluator |
| TTS | Groq PlayAI TTS | AI interviewer's voice |
| Backend | FastAPI (Python) | API routes, PDF parsing, Groq calls |
| PDF Parser | pdfplumber | Resume text extraction |
| Database | Supabase (PostgreSQL) | Questions, reports, auth, audits |

| Table | Purpose |
|---|---|
| questions | 240-question bank (company/round/difficulty/expected_concepts) |
| interview_reports | Full session transcripts + vision logs + final scores |
| resume_audits | Raw resume text + JD + audit JSON result |

| Prompt | Lives In | Output Format |
|---|---|---|
| RESUME_AUDITOR_PROMPT | /config/prompts.py | Strict JSON only |
| ACTIVE_INTERVIEWER_PROMPT | /config/prompts.py | Short plain-text sentences |
| POST_INTERVIEW_EVALUATOR_PROMPT | /config/prompts.py | Strict JSON only |
