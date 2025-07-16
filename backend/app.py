from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from resume_parsar import parse_resume, analyze_resume as gemini_analyze_resume
from jd_matcher import compute_similarity
from skill_matcher import compare_skills
from course_recommender import suggest_courses
from bullet_enhancer import improve_bullet



app = Flask(__name__, static_folder=None)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze_resume():
    """Analyze resume against job description and return results."""
    try:
        if 'file' not in request.files or 'jd' not in request.form:
            return jsonify({'error': 'Resume or Job Description missing'}), 400

        file = request.files['file']
        jd_text = request.form['jd']
        parsed = parse_resume(file)
        resume_text = parsed.get("text", "")

        # Debug prints for text extraction
        print("Resume text:", resume_text[:500])
        print("JD text:", jd_text[:500])
        match_score = compute_similarity(resume_text, jd_text)
        skill_data = compare_skills(resume_text, jd_text)
        # Debug prints for skill extraction
        print("Resume skills:", skill_data.get("resume_skills"))
        print("JD skills:", skill_data.get("jd_skills"))
        try:
            course_data = suggest_courses(skill_data["missing_skills"])
        except Exception as e:
            print("Course suggestion error:", e)
            course_data = {"error": str(e)}

        # Call Gemini AI analysis
        gemini_analysis = gemini_analyze_resume(resume_text, jd_text)

        # Optionally: predict overall resume score
        total_score = round(match_score * (len(skill_data['matched_skills']) / max(1, len(skill_data['jd_skills']))), 2)

        result = {
            **parsed,
            "match_score": match_score,
            "resume_score": total_score,
            **skill_data,
            "course_suggestions": course_data,
            "gemini_analysis": gemini_analysis
        }
        return jsonify(result)
    except Exception as e:
        print("Exception in /analyze:", e)  # Add this line
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/enhance', methods=['POST'])
def enhance_bullet():
    """Enhance a single resume bullet point."""
    try:
        data = request.json
        bullet = data.get("bullet", "")
        if not bullet:
            return jsonify({"error": "Bullet text is missing"}), 400

        improved = improve_bullet(bullet)
        return jsonify({"original": bullet, "improved": improved})
    except Exception as e:
        print("Exception in /analyze:", e)  # Add this line
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500



# Serve React build static files
import os

@app.route('/static/<path:filename>')
def serve_static(filename):
    build_static_dir = os.path.join(os.path.dirname(__file__), 'build', 'static')
    print('Serving static file:', os.path.join(build_static_dir, filename))
    return send_from_directory(build_static_dir, filename)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    print('Serving react path:', path)
    build_dir = os.path.join(os.path.dirname(__file__), 'build')
    if path != "" and os.path.exists(os.path.join(build_dir, path)):
        return send_from_directory(build_dir, path)
    else:
        return send_from_directory(build_dir, 'index.html')

if __name__ == "__main__":
    app.run(port=8000)