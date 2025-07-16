import re
import string

# Simple predefined skill set (can be expanded)
SKILL_LIST = [
    # Programming languages
    "python", "java", "c++", "c#", "typescript", "sql", "html", "css", "javascript", "r", "go", "ruby", "php", "swift", "kotlin", "scala", "perl", "matlab",
    # Data science & ML
    "machine learning", "deep learning", "nlp", "data analysis", "data engineering", "statistics", "data mining", "big data", "predictive modeling", "data wrangling", "feature engineering",
    "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "matplotlib", "seaborn", "data visualization", "keras", "xgboost", "lightgbm", "spacy", "nltk", "gensim",
    # Frameworks & libraries
    "react", "flask", "fastapi", "django", "spring", "express", "angular", "vue", "next.js", "node.js", "bootstrap", "jquery", "redux", "rest framework",
    "mongodb", "mysql", "postgresql", "sqlite", "oracle", "firebase", "elasticsearch", "redis", "cassandra", "neo4j",
    "git", "docker", "aws", "azure", "gcp", "spark", "hadoop", "kubernetes", "airflow", "tableau", "power bi", "looker", "superset",
    # Tools & platforms
    "linux", "bash", "shell scripting", "command line", "jira", "confluence", "trello", "asana", "notion", "postman", "graphql", "rest api", "soap api", "selenium", "cypress", "jenkins", "travis ci", "circleci", "github actions", "bitbucket", "gitlab",
    # Cloud & DevOps
    "devops", "ci/cd", "infrastructure as code", "terraform", "ansible", "cloudformation", "serverless", "lambda", "docker swarm", "openshift",
    # Security
    "cybersecurity", "penetration testing", "vulnerability assessment", "network security", "encryption", "firewall", "siem", "iam", "oauth", "sso",
    # Methodologies
    "agile", "scrum", "kanban", "waterfall", "tdd", "bdd", "unit testing", "integration testing", "system design", "oop", "design patterns", "microservices", "monolith",
    # Business & Analytics
    "business analysis", "requirement gathering", "stakeholder management", "project management", "product management", "roadmapping", "kpi", "roi", "a/b testing", "market research", "competitive analysis",
    # Soft skills
    "problem solving", "critical thinking", "communication", "leadership", "teamwork", "collaboration", "adaptability", "creativity", "time management", "presentation", "negotiation", "conflict resolution", "empathy", "work ethic"
]

def extract_skills(text):
    """
    Extract known skills from the input text using both keyword matching and spaCy NER.
    Args:
        text (str): Input text to search for skills.
    Returns:
        list: Sorted list of found skills.
    """
    if not text or not isinstance(text, str):
        return []
    # Improved keyword-based extraction for special skills like c++/c#
    lowered = text.lower()
    # Replace only delimiters that are not + or #
    delimiters = [',', ';', '/', '\\', '|', '\n', '\t']
    for delim in delimiters:
        lowered = lowered.replace(delim, ' ')
    # Remove punctuation except for + and # (for c++/c#)
    allowed = '+#'
    lowered = ''.join(ch if ch.isalnum() or ch.isspace() or ch in allowed else ' ' for ch in lowered)
    found = set()
    for skill in SKILL_LIST:
        # Special handling for c++ and c# to allow matching at word boundaries or surrounded by punctuation
        if skill in {"c++", "c#"}:
            pattern = r'(?<!\w)' + re.escape(skill) + r'(?!\w)'
        else:
            pattern = r'\b' + re.escape(skill) + r's?\b'
        if re.search(pattern, lowered):
            found.add(skill)
    return sorted(found)

def compare_skills(resume_text, jd_text):
    """
    Compare skills between resume and job description text.
    Args:
        resume_text (str): Resume text.
        jd_text (str): Job description text.
    Returns:
        dict: Skills found in resume, JD, matched, and missing.
    """
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(jd_text)

    matched = sorted(list(set(resume_skills) & set(jd_skills)))
    missing = sorted(list(set(jd_skills) - set(resume_skills)))

    return {
        "resume_skills": resume_skills,
        "jd_skills": jd_skills,
        "matched_skills": matched,
        "missing_skills": missing
    }
