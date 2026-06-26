import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get("SUPABASE_URL", "")
key: str = os.environ.get("SUPABASE_KEY", "")

supabase: Client = create_client(url, key)

def get_questions(company_name: str, round_type: str, difficulty: str):
    response = supabase.table("questions").select("*") \
        .eq("company_name", company_name) \
        .eq("round_type", round_type) \
        .eq("difficulty", difficulty) \
        .execute()
    return response.data

def save_report(session_id: str, report_data: dict):
    data_to_insert = {
        "session_id": session_id,
        "scores": report_data.get("scores"),
        "behavioral_timeline": report_data.get("behavioral_timeline"),
        "star_gaps": report_data.get("star_gaps"),
        "practice_roadmap": report_data.get("practice_roadmap"),
        "cheating_flags": report_data.get("cheating_flags"),
    }
    response = supabase.table("interview_reports").insert(data_to_insert).execute()
    return response.data
