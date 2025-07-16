import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

def suggest_courses(missing_skills):
    """
    Use Gemini to recommend online courses and YouTube videos for each missing skill.
    Args:
        missing_skills (list): List of missing skill strings.
    Returns:
        dict: {skill: {"courses": [...], "youtube": [...]}}
    """
    if not missing_skills:
        return {}
    # Only use the top 5 missing skills
    top_skills = missing_skills[:5]
    prompt = f"""
You are a career and learning advisor. For each of the following skills, recommend:
1. One high-quality online course (with link)
2. One high-quality YouTube video (with link)
Return the results in JSON format as:
{{
  "skill": {{
    "courses": ["Course Title - URL", ...],
    "youtube": ["Video Title - URL", ...]
  }},
  ...
}}

Skills:
{', '.join(top_skills)}
"""
    try:
        response = model.generate_content(prompt)
        import json
        # Try to extract JSON from the response
        text = response.text.strip()
        # Find the first and last curly braces to extract JSON
        start = text.find('{')
        end = text.rfind('}') + 1
        if start != -1 and end != -1:
            json_str = text[start:end]
            return json.loads(json_str)
        else:
            return {"error": "Could not parse Gemini response as JSON", "raw": text}
    except Exception as e:
        return {"error": str(e)}
