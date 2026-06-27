# HIREVAULT — App Overview Prompt
> Paste this at the start of any new conversation to give the AI full context about what HIREVAULT is and how it works.

---

## WHAT IS HIREVAULT?

HIREVAULT is an AI-powered interview prep and resume auditing web app built for college students in India targeting tech jobs at companies like Google, Amazon, and TCS.

**Tech Stack:**
- Frontend: Next.js + Tailwind CSS
- Backend: FastAPI (Python)
- Database: Supabase (PostgreSQL)
- AI: Groq LLaMA 3 (LLM) + Groq Whisper (speech-to-text) + Groq TTS (voice output)
- Vision: MediaPipe FaceMesh (webcam eye tracking, 3 FPS max)
- Auth: Supabase Auth (email + password)

---

## TOTAL PAGES — 9 Pages

| # | Route | Page Name | Purpose |
|---|---|---|---|
| 1 | `/` | Landing Page | App home — two CTA cards + feature info |
| 2 | `/login` | Login / Signup | Supabase email+password auth |
| 3 | `/dashboard` | Dashboard | Shows last 3 audits + last 3 interview scores |
| 4 | `/audit` | Resume Audit Input | Upload PDF + paste Job Description |
| 5 | `/audit/results` | Audit Results | ATS score ring, breakdown cards, correction feed |
| 6 | `/interview/setup` | Interview Setup | Pick company, round, difficulty, time limit |
| 7 | `/interview/room` | Interview Room | Live split-screen interview (voice + whiteboard) |
| 8 | `/interview/report` | Post-Interview Report | Full HireReady evaluation report |
| 9 | `/interview/report` | (shared) | Report also accessible after interview ends |

---

## HOW THE APP WORKS — Two Core Flows

### FLOW 1 — AI Resume Auditor

```
User lands on / → clicks "Try Auditor" → goes to /audit

/audit page:
  - Left panel: drag-and-drop PDF upload zone
  - Right panel: textarea to paste the Job Description
  - Button: "Generate ATS Audit"
  - On click → POST /api/audit (FastAPI backend)
    → pdfplumber extracts text from PDF
    → Groq LLaMA 3 analyses resume vs JD using RESUME_AUDITOR_PROMPT
    → Returns strict JSON:
        {
          ats_score: 78,
          score_breakdown: { keyword_match, impact_and_metrics, formatting, core_fundamentals },
          missing_keywords: ["Docker", "CI/CD"],
          corrections: [{ original_line, issue, suggested_fix }]
        }
  - Result stored in sessionStorage → router pushes to /audit/results

/audit/results page:
  - Animated SVG ring showing ATS score out of 100
  - 4 breakdown metric cards (scores out of 40/30/20/10)
  - Missing keywords as red badge chips
  - Scrollable list of CorrectionCards (red original line + green suggested fix + copy button)
```

---

### FLOW 2 — AI Mock Interviewer

```
User lands on / → clicks "Start Mock Interview" → goes to /interview/setup

/interview/setup page:
  - 5 dropdowns: Company | Role | Round Type | Difficulty | Time Limit
  - Button: "Start Interview"
  - On click → GET /api/questions (FastAPI)
    → Fetches 20 questions from Supabase questions table filtered by company/round/difficulty
    → 2.5 second artificial loading screen (cycling text: "Selecting questions..." etc.)
    → Questions + config stored in sessionStorage → router pushes to /interview/room

/interview/room page (split-screen, full-height):
  LEFT PANEL (AI Interviewer side):
    - WaveVisualizer: animated SVG/canvas waveform with 4 states:
        IDLE → flat pulse line
        LISTENING → reacts to mic volume via Web Audio API
        THINKING → color-shift glow animation
        SPEAKING → pulses fast with TTS output
    - Status text: "Interviewer is listening..." / "thinking..." / "speaking..."
    - Webcam PIP (bottom-left): small 200x150 box showing user's face (MediaPipe is tracking at 3FPS)
    - Timer (top-center): countdown in MM:SS from selected time limit
    - "Open Whiteboard" button

  RIGHT PANEL (Technical Whiteboard — slides in when activated):
    - Monospace textarea code editor
    - Close button

  WHAT HAPPENS LIVE:
    1. WebSocket opens to ws://localhost:8000/ws/interview
    2. VADController monitors mic via Web Audio API
    3. When user stops speaking (silence > 500ms) → captures audio chunk
    4. Plays filler audio ("Hmm, okay...") + sets wave to THINKING
    5. Sends audio + vision_log snapshot over WebSocket to backend
    6. Backend: Groq Whisper transcribes → Groq LLaMA replies as interviewer → streams response
    7. Frontend receives AI text → SpeechSynthesis speaks it → wave switches to SPEAKING
    8. MediaPipe tracks eye contact at 3 FPS, logs to vision_log array
    9. If whiteboard is open: gaze to right side is NOT flagged as cheating

  END INTERVIEW:
    - User clicks "End Interview" OR timer hits zero
    - POST /api/evaluate with full_transcript + vision_log + session_meta
    - Backend: Groq LLaMA evaluates using POST_INTERVIEW_EVALUATOR_PROMPT
    - Saves to Supabase interview_reports table
    - Returns JSON report → stored in sessionStorage → router pushes to /interview/report

/interview/report page:
  - Section 1: 4 score cards (Technical Accuracy / Communication / Confidence / Overall) — count-up animation
  - Section 2: Behavioral timeline bar — red/green dot markers you can hover to see events
  - Section 3: STAR Gap Finder — which questions had missing S/T/A/R components
  - Section 4: Practice Roadmap — 2-3 targeted improvement suggestions
  - Section 5: Integrity Flags — shown only if cheating_flags array is non-empty (eye scanning detected)
  - Buttons: "Download Report" (window.print) + "Practice Again" (→ /interview/setup)
```

---

## LANDING PAGE — `/` (page.jsx)

**Current design (post-rollback, clean dark theme):**

```
Background: bg-[#0a0a0a] (deep dark, no animated background)
Layout: centered flex-col, max-w-5xl

SECTION 1 — Hero:
  - H1: "HIREVAULT" in large gradient text (indigo → violet → fuchsia)
  - Subtitle: "AI-powered interview prep and resume auditing for college students in India."
  - Small line: "Built for students targeting Google, Amazon, TCS and more."

SECTION 2 — Two CTA Cards (md:grid-cols-2):
  LEFT CARD: AI Resume Auditor
    - Indigo icon (document SVG)
    - Title + description
    - Button: "Try Auditor" → routes to /audit
    - Hover: border turns indigo, button fills indigo-600

  RIGHT CARD: AI Mock Interviewer
    - Fuchsia icon (microphone SVG)
    - Title + description
    - Button: "Start Mock Interview" → routes to /interview/setup
    - Hover: border turns fuchsia, button fills fuchsia-600

SECTION 3 — "What each tool does" (detailed feature breakdown):
  Two-column layout:
    LEFT: Resume Auditor details
      - Bullet 1: ATS Score / 100 — scored across 4 buckets
      - Bullet 2: Missing Keywords — exact ATS scanner keywords missing
      - Bullet 3: Line-by-Line Corrections — original + rewritten with metrics

    RIGHT: Mock Interviewer details
      - Bullet 1: Live Voice Conversation — STT + TTS via Groq
      - Bullet 2: Technical Whiteboard — slides in for coding rounds
      - Bullet 3: Webcam Proctoring — MediaPipe 3FPS eye tracking
      - Bullet 4: HireReady Report — full JSON evaluation

SECTION 4 — "How it works" (4 step cards):
  01 Upload Resume → 02 Configure Session → 03 Interview Live → 04 Get Your Report

SECTION 5 — "Supported companies":
  Google | Amazon | TCS | + More Coming Soon (as badge chips)

SECTION 6 — Tech Stack note (small text at bottom):
  Next.js · FastAPI · Groq LLaMA 3 + Whisper · MediaPipe · Supabase
```

---

## KEY FILES TO KNOW

```
frontend/
  app/
    page.jsx                    ← Landing page
    layout.jsx                  ← Root layout (Navbar + body)
    globals.css                 ← Tailwind base + scrollbar styles
    login/page.jsx              ← Auth page
    dashboard/page.jsx          ← User dashboard
    audit/
      page.jsx                  ← Resume upload + JD input
      results/page.jsx          ← ATS results display
    interview/
      setup/page.jsx            ← Interview config form
      room/page.jsx             ← Live interview room
      report/page.jsx           ← Post-interview report

  components/
    Navbar.jsx                  ← Fixed top navbar
    ResumeUploader.jsx          ← Drag-and-drop PDF zone
    ATSScoreDashboard.jsx       ← Animated score ring + 4 metric cards
    CorrectionCard.jsx          ← Before/after resume correction card
    InterviewSetup.jsx          ← Interview config form component
    InterviewRoom.jsx           ← Main interview room (WebSocket + VAD + MediaPipe)
    WaveVisualizer.jsx          ← Audio waveform (4 states: IDLE/LISTENING/THINKING/SPEAKING)
    WhiteboardEditor.jsx        ← Static monospace code textarea
    PostInterviewReport.jsx     ← Full report component (5 sections)
    PlasmaWave.jsx              ← WebGL animated background (NOT currently in use — available)

  lib/
    vadController.js            ← Voice Activity Detection (Web Audio API)
    mediapipeController.js      ← MediaPipe FaceMesh at 3 FPS
    supabaseClient.js           ← Supabase JS client
    groqClient.js               ← Groq API client

  config/
    prompts.js                  ← RESUME_AUDITOR_PROMPT, ACTIVE_INTERVIEWER_PROMPT, POST_INTERVIEW_EVALUATOR_PROMPT

backend/
  main.py                       ← FastAPI app entry
  routers/
    resume.py                   ← POST /api/audit
    interview.py                ← GET /api/questions + WebSocket /ws/interview
    report.py                   ← POST /api/evaluate
  services/
    pdf_parser.py               ← pdfplumber text extraction
    groq_service.py             ← All Groq API calls
    supabase_service.py         ← DB queries (questions, save report)
  config/
    prompts.py                  ← Backend copies of 3 system prompts
```

---

## SUPABASE TABLES

| Table | Purpose |
|---|---|
| `questions` | 240-question bank — company / role / round_type / difficulty / primary_question / expected_concepts |
| `interview_reports` | Full session data — transcript + vision_log + final_report JSON |
| `resume_audits` | Raw resume text + JD + audit_result JSON |

---

## THREE PLACEHOLDER PROMPTS (not yet filled)

These three prompts live in `backend/config/prompts.py` and `frontend/config/prompts.js`.
They are currently empty strings — fill them before running the AI features:

1. `RESUME_AUDITOR_PROMPT` — Makes LLM act as a FAANG recruiter, outputs strict JSON with ATS score + corrections
2. `ACTIVE_INTERVIEWER_PROMPT` — Makes LLM act as a company-specific interviewer, outputs plain conversational text only
3. `POST_INTERVIEW_EVALUATOR_PROMPT` — Makes LLM act as a Senior Assessor, outputs strict JSON evaluation report
