from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import resume, interview, report

app = FastAPI(title="HIREVAULT API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router)
app.include_router(interview.router)
app.include_router(report.router)

@app.get("/api/health")
async def health_check():
    return {"status": "awake", "message": "Backend is running"}
