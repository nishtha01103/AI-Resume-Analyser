from sentence_transformers import SentenceTransformer, util

# Load once globally
model = SentenceTransformer('all-MiniLM-L6-v2')

def compute_similarity(resume_text, jd_text):
    """
    Compute similarity score (percentage) between resume and job description text using sentence embeddings.
    Returns 0 if input is invalid or on error.
    """
    if not resume_text or not jd_text or not isinstance(resume_text, str) or not isinstance(jd_text, str):
        return 0.0
    try:
        embeddings = model.encode([resume_text, jd_text], convert_to_tensor=True)
        score = util.cos_sim(embeddings[0], embeddings[1]).item()
        return round(score * 100, 2)  # return as percentage
    except Exception as e:
        # Optionally, log the error here
        return 0.0
