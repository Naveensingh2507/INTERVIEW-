import pdfplumber
import io
from fastapi import UploadFile

def parse_pdf(file: UploadFile) -> str:
    try:
        content = file.file.read()
        
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            extracted_text = ""
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"
        
        file.file.seek(0)
        
        if not extracted_text.strip():
            raise ValueError("No text could be extracted from the PDF. The file may be empty or an image.")
            
        return extracted_text.strip()
    except Exception as e:
        raise ValueError(f"Failed to read PDF file: {str(e)}")
