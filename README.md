
# AI Resume Analyzer

A fullstack application for analyzing resumes against job descriptions, enhancing resume bullets, and recommending courses for missing skills. Built with Flask (backend) and React (frontend).

## Tech Stack
- **Frontend:** React, Axios, JavaScript, HTML, CSS
- **Backend:** Flask, Gunicorn, flask-cors
- **AI/ML:** scikit-learn, sentence-transformers, spaCy, NLTK, Gemini API (google-generativeai)
- **Parsing:** pdfminer.six, python-docx, pdfplumber, pdf2image, pytesseract
- **Other:** numpy, python-dotenv

## Features
- Upload a resume and job description to get:
  - Skill matching and gap analysis
  - AI-powered resume bullet enhancement
  - Top 5 course and YouTube video recommendations for missing skills (via Gemini API)
  - Gemini AI analysis summary
- Clean, modern React frontend
- Robust Flask backend with modular code

## Project Structure
```
Ai-resume-analyser/
├── backend/
│   ├── app.py                # Flask app entry point
│   ├── skill_matcher.py      # Skill extraction and comparison
│   ├── resume_parsar.py      # Resume parsing logic
│   ├── jd_matcher.py         # JD similarity logic
│   ├── course_recommender.py # Gemini API for course suggestions
│   ├── bullet_enhancer.py    # Bullet point enhancement
│   ├── requirements.txt      # Python dependencies
│   └── build/                # React build output (copied from frontend)
├── frontend/
│   ├── src/                  # React source code
│   ├── public/
│   ├── package.json
│   └── ...
├── .gitignore
└── README.md
```

## Setup Instructions

### 1. Clone the repository
```sh
git clone https://github.com/your-username/AI-Resume-Analyser.git
cd AI-Resume-Analyser
```

### 2. Backend Setup
```sh
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```
- Create a `.env` file in `backend/` with your Gemini API key:
  ```
  GEMINI_API_KEY=your_gemini_api_key
  ```

### 3. Frontend Setup
```sh
cd ../frontend
npm install
npm run build
```
- Copy the `frontend/build` folder into the `backend` directory (replace if exists).

### 4. Run the App
- **Development:**
  ```sh
  cd backend
  python app.py
  # App runs at http://localhost:8000
  ```
- **Production (recommended):**
  ```sh
  gunicorn app:app --bind 0.0.0.0:8000 --workers 1
  ```

### 5. Access the App
Open [http://localhost:8000](http://localhost:8000) in your browser.

## Deployment
- For cloud deployment (Heroku, Render, AWS, etc.), see platform-specific instructions or ask for a step-by-step guide.
- Use a reverse proxy (Nginx) for production.

## Notes
- All environment files and build outputs are gitignored.
- Only technical/important skills from the predefined list are extracted.
- For best results, keep your dependencies up to date.

## License
MIT
# AI-Resume-Analyser