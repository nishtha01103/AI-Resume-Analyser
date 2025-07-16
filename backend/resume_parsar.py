import google.generativeai as genai

# Function to get response from Gemini AI
def analyze_resume(resume_text, job_description=None):
    if not resume_text:
        return {"error": "Resume text is required for analysis."}
    model = genai.GenerativeModel("gemini-1.5-flash")
    base_prompt = f"""
    You are an experienced HR with Technical Experience in the field of any one job role from Data Science, Data Analyst, DevOPS, Machine Learning Engineer, Prompt Engineer, AI Engineer, Full Stack Web Development, Big Data Engineering, Marketing Analyst, Human Resource Manager, Software Developer your task is to review the provided resume.
    Please share your professional evaluation on whether the candidate's profile aligns with the role.ALso mention Skills he already have and siggest some skills to imorve his resume , alos suggest some course he might take to improve the skills.Highlight the strengths and weaknesses.

    Resume:
    {resume_text}
    """
    if job_description:
        base_prompt += f"""
        Additionally, compare this resume to the following job description:
        
        Job Description:
        {job_description}
        
        Highlight the strengths and weaknesses of the applicant in relation to the specified job requirements.
        """
    response = model.generate_content(base_prompt)
    analysis = response.text.strip()
    return analysis

import os
import docx
import re
import io
# Robust PDF extraction
import pdfplumber
from pdf2image import convert_from_path
import pytesseract

def extract_text_from_pdf(file):
    """Extract text from a PDF file object, with OCR fallback for image-based PDFs."""
    text = ""
    try:
        # Save file-like object to a temporary file for pdfplumber/pdf2image
        file.seek(0)
        pdf_bytes = file.read()
        file.seek(0)
        with open("temp_resume.pdf", "wb") as temp_pdf:
            temp_pdf.write(pdf_bytes)

        # Try direct text extraction
        with pdfplumber.open("temp_resume.pdf") as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        if text.strip():
            os.remove("temp_resume.pdf")
            return text.strip()
    except Exception as e:
        print(f"Direct text extraction failed: {e}")

    # Fallback to OCR for image-based PDFs
    print("Falling back to OCR for image-based PDF.")
    try:
        images = convert_from_path("temp_resume.pdf")
        for image in images:
            page_text = pytesseract.image_to_string(image)
            text += page_text + "\n"
    except Exception as e:
        print(f"OCR failed: {e}")
    finally:
        if os.path.exists("temp_resume.pdf"):
            os.remove("temp_resume.pdf")
    return text.strip()

def extract_text_from_docx(file):
    """Extract text from a DOCX file object."""
    try:
        file.seek(0)
        doc = docx.Document(file)
        return "\n".join([para.text for para in doc.paragraphs])
    except Exception as e:
        print("DOCX extraction error:", e)
        return ""

def extract_email(text):
    """Extract the first email address from text."""
    match = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b', text)
    return match[0].strip() if match else ""

def extract_phone(text):
    """Extract the first phone number from text."""
    match = re.findall(r'\+?\d[\d -]{8,12}\d', text)
    return match[0].strip() if match else ""

def parse_resume(file):
    """
    Parse a resume file (PDF or DOCX) and extract key information.
    Returns a dict with full text, preview, email, phone, and word count.
    """
    filename = file.filename.lower()
    text = ""

    if filename.endswith('.pdf'):
        text = extract_text_from_pdf(file)
    elif filename.endswith('.docx'):
        text = extract_text_from_docx(file)
    else:
        return {"error": "Unsupported file format"}

    if not text.strip():
        return {"error": "Could not extract text from file"}

    email = extract_email(text)
    phone = extract_phone(text)

    parsed_data = {
        "text": text,  # full text
        "preview": text[:500],
        "email": email,
        "phone": phone,
        "word_count": len(text.split())
    }

    return parsed_data
