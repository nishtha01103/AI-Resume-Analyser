import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash")

def improve_bullet(bullet_text):
    """
    Enhance a single resume bullet point using Gemini API.
    Args:
        bullet_text (str): The bullet point to improve.
    Returns:
        str: Improved bullet point or error message.
    """
    if not bullet_text or not isinstance(bullet_text, str):
        return "Error: Invalid bullet text."
    prompt = f"""
Improve the following resume bullet point to sound more professional and impactful:

"{bullet_text}"

Make it concise, action-oriented, and results-focused.
"""
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"Error: {str(e)}"
    
