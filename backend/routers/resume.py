from fastapi import APIRouter, File, UploadFile, Form, HTTPException
import json
from services.pdf_parser import parse_pdf
from services.groq_service import audit_resume

router = APIRouter()

@router.post("/api/audit")
async def audit_resume_endpoint(
    job_description: str = Form(...),
    file: UploadFile = File(...)
):
    # Step 1: Parse PDF
    try:
        resume_text = parse_pdf(file)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error while parsing PDF.")
        
    # Step 2: Call LLM
    try:
        raw_json_response = audit_resume(resume_text, job_description)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"LLM Processing Error: {str(e)}")
        
    # Step 3: Parse JSON and return
    try:
        parsed_result = json.loads(raw_json_response)
        return parsed_result
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500, 
            detail="LLM failed to return a valid JSON response."
        )
