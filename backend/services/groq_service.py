import os
import json
from groq import Groq
from config.prompts import RESUME_AUDITOR_PROMPT

# Initialize Groq client
client = Groq()

def audit_resume(resume_text: str, job_description: str) -> str:
    user_message = f"""
[JOB DESCRIPTION]
{job_description}

[RESUME TEXT]
{resume_text}
"""
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": RESUME_AUDITOR_PROMPT
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.2,
            response_format={"type": "json_object"}
        )
        
        return chat_completion.choices[0].message.content
    except Exception as e:
        raise RuntimeError(f"Error calling Groq API: {str(e)}")
