from io import BytesIO
import re

from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel
from pypdf import PdfReader


router = APIRouter(
    prefix="/api/resume",
    tags=["Resume Analyzer"]
)


# =========================================================
# SKILL DATABASE
# =========================================================

SKILLS = [
    "python",
    "java",
    "javascript",
    "typescript",
    "c",
    "c++",
    "c#",
    "html",
    "css",
    "react",
    "react.js",
    "node.js",
    "node",
    "express",
    "fastapi",
    "django",
    "flask",
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "firebase",
    "git",
    "github",
    "docker",
    "aws",
    "azure",
    "gcp",
    "rest api",
    "api",
    "machine learning",
    "deep learning",
    "artificial intelligence",
    "data science",
    "pandas",
    "numpy",
    "power bi",
    "tableau",
    "excel",
    "figma",
    "ui/ux",
    "communication",
    "problem solving",
    "data analysis",
    "business analysis",
    "agile",
    "jira",
    "spring boot",
    "java swing",
    "bootstrap",
    "tailwind",
]


ROLE_SKILLS = {
    "software developer": [
        "python",
        "java",
        "javascript",
        "sql",
        "git",
        "github",
        "rest api",
        "problem solving",
    ],

    "frontend developer": [
        "html",
        "css",
        "javascript",
        "react",
        "git",
        "github",
        "typescript",
    ],

    "backend developer": [
        "python",
        "java",
        "node.js",
        "sql",
        "rest api",
        "git",
        "docker",
    ],

    "full stack developer": [
        "html",
        "css",
        "javascript",
        "react",
        "node.js",
        "sql",
        "git",
        "rest api",
    ],

    "data analyst": [
        "python",
        "sql",
        "excel",
        "pandas",
        "numpy",
        "power bi",
        "data analysis",
    ],

    "business analyst": [
        "sql",
        "excel",
        "power bi",
        "business analysis",
        "communication",
        "agile",
        "jira",
        "problem solving",
    ],

    "data scientist": [
        "python",
        "sql",
        "pandas",
        "numpy",
        "machine learning",
        "data science",
    ],

    "ui/ux designer": [
        "figma",
        "ui/ux",
        "communication",
        "problem solving",
    ],
}


DISPLAY_NAMES = {
    "python": "Python",
    "java": "Java",
    "javascript": "JavaScript",
    "typescript": "TypeScript",
    "c": "C",
    "c++": "C++",
    "c#": "C#",
    "html": "HTML",
    "css": "CSS",
    "react": "React",
    "react.js": "React.js",
    "node.js": "Node.js",
    "node": "Node.js",
    "express": "Express",
    "fastapi": "FastAPI",
    "django": "Django",
    "flask": "Flask",
    "sql": "SQL",
    "mysql": "MySQL",
    "postgresql": "PostgreSQL",
    "mongodb": "MongoDB",
    "firebase": "Firebase",
    "git": "Git",
    "github": "GitHub",
    "docker": "Docker",
    "aws": "AWS",
    "azure": "Azure",
    "gcp": "Google Cloud",
    "rest api": "REST API",
    "api": "API",
    "machine learning": "Machine Learning",
    "deep learning": "Deep Learning",
    "artificial intelligence": "Artificial Intelligence",
    "data science": "Data Science",
    "pandas": "Pandas",
    "numpy": "NumPy",
    "power bi": "Power BI",
    "tableau": "Tableau",
    "excel": "Excel",
    "figma": "Figma",
    "ui/ux": "UI/UX",
    "communication": "Communication",
    "problem solving": "Problem Solving",
    "data analysis": "Data Analysis",
    "business analysis": "Business Analysis",
    "agile": "Agile",
    "jira": "Jira",
    "spring boot": "Spring Boot",
    "java swing": "Java Swing",
    "bootstrap": "Bootstrap",
    "tailwind": "Tailwind CSS",
}


# =========================================================
# JOB MATCH REQUEST
# =========================================================

class JobMatchRequest(BaseModel):
    job_description: str
    resume_text: str
    target_role: str = "Software Developer"


# =========================================================
# HELPERS
# =========================================================

def normalize_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def contains_skill(text: str, skill: str) -> bool:
    pattern = (
        r"(?<![a-z0-9])"
        + re.escape(skill.lower())
        + r"(?![a-z0-9])"
    )

    return re.search(pattern, text) is not None


def detect_skills(text: str) -> list[str]:
    normalized = normalize_text(text)

    found = []

    for skill in SKILLS:
        if contains_skill(normalized, skill):

            display_name = DISPLAY_NAMES.get(
                skill,
                skill.title()
            )

            if display_name not in found:
                found.append(display_name)

    return found


def calculate_skill_score(skills: list[str]) -> int:
    if not skills:
        return 0

    return round(
        min(len(skills) / 8, 1) * 100
    )


def calculate_section_score(text: str) -> int:

    normalized = normalize_text(text)

    sections = [
        ["education", "academic"],
        [
            "experience",
            "work experience",
            "employment",
            "internship"
        ],
        ["project", "projects"],
        ["skills", "technical skills"],
        [
            "certification",
            "certifications",
            "certificate"
        ]
    ]

    found_sections = 0

    for keywords in sections:

        if any(
            keyword in normalized
            for keyword in keywords
        ):
            found_sections += 1

    return round(
        found_sections / len(sections) * 100
    )


def calculate_content_score(text: str) -> int:

    word_count = len(text.split())

    if word_count >= 500:
        return 100

    if word_count >= 350:
        return 90

    if word_count >= 250:
        return 80

    if word_count >= 150:
        return 65

    if word_count >= 80:
        return 45

    return 25


def calculate_role_match(
    skills: list[str],
    target_role: str
) -> int:

    role_key = target_role.strip().lower()

    required = ROLE_SKILLS.get(
        role_key,
        []
    )

    if not required:
        return 50

    current = {
        skill.lower()
        for skill in skills
    }

    matched = 0

    for skill in required:

        display_name = DISPLAY_NAMES.get(
            skill,
            skill.title()
        )

        if display_name.lower() in current:
            matched += 1

    return round(
        matched / len(required) * 100
    )


def calculate_ats_score(
    skill_score: int,
    section_score: int,
    content_score: int,
    role_match: int
) -> int:

    score = (
        skill_score * 0.35
        + section_score * 0.25
        + content_score * 0.20
        + role_match * 0.20
    )

    return max(
        0,
        min(
            100,
            round(score)
        )
    )


def get_missing_skills(
    skills: list[str],
    target_role: str
) -> list[str]:

    role_key = target_role.strip().lower()

    required = ROLE_SKILLS.get(
        role_key,
        []
    )

    current = {
        skill.lower()
        for skill in skills
    }

    missing = []

    for skill in required:

        display_name = DISPLAY_NAMES.get(
            skill,
            skill.title()
        )

        if display_name.lower() not in current:
            missing.append(display_name)

    return missing


def generate_suggestions(
    text: str,
    skills: list[str],
    missing_skills: list[str],
    ats_score: int
) -> list[str]:

    normalized = normalize_text(text)

    suggestions = []

    if "github" not in normalized:
        suggestions.append(
            "Add your GitHub profile and relevant repositories."
        )

    if "linkedin" not in normalized:
        suggestions.append(
            "Add your LinkedIn profile to improve recruiter visibility."
        )

    if "project" not in normalized:
        suggestions.append(
            "Add 2–3 strong projects with technologies and measurable results."
        )

    if (
        "experience" not in normalized
        and "internship" not in normalized
    ):
        suggestions.append(
            "Include internships, training, freelance work, or practical experience."
        )

    if (
        "certification" not in normalized
        and "certificate" not in normalized
    ):
        suggestions.append(
            "Add relevant certifications that support your target role."
        )

    if missing_skills:

        suggestions.append(
            "Consider learning: "
            + ", ".join(missing_skills[:5])
            + "."
        )

    if ats_score < 60:

        suggestions.append(
            "Improve keyword alignment and strengthen your project descriptions."
        )

    elif ats_score < 80:

        suggestions.append(
            "Your resume has a good foundation. Add role-specific keywords and measurable achievements."
        )

    else:

        suggestions.append(
            "Your resume is well aligned. Tailor keywords for every job description you apply to."
        )

    return suggestions[:6]


def get_resume_sections(text: str) -> dict:

    normalized = normalize_text(text)

    return {
        "Education": (
            "education" in normalized
            or "academic" in normalized
        ),

        "Experience": (
            "experience" in normalized
            or "work experience" in normalized
            or "employment" in normalized
            or "internship" in normalized
        ),

        "Projects": (
            "project" in normalized
        ),

        "Skills": (
            "skills" in normalized
            or "technical skills" in normalized
        ),

        "Certifications": (
            "certification" in normalized
            or "certificate" in normalized
        )
    }


# =========================================================
# RESUME ANALYZER
# =========================================================

@router.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    target_role: str = "Software Developer"
):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Please select a resume file."
        )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF resumes are supported."
        )

    try:

        file_content = await file.read()

        max_size = 5 * 1024 * 1024

        if len(file_content) > max_size:
            raise HTTPException(
                status_code=400,
                detail="Resume must be smaller than 5 MB."
            )

        if len(file_content) == 0:
            raise HTTPException(
                status_code=400,
                detail="The uploaded file is empty."
            )

        pdf = PdfReader(
            BytesIO(file_content)
        )

        if not pdf.pages:
            raise HTTPException(
                status_code=400,
                detail="The PDF does not contain any pages."
            )

        resume_text_parts = []

        for page in pdf.pages:

            page_text = page.extract_text()

            if page_text:
                resume_text_parts.append(
                    page_text
                )

        resume_text = "\n".join(
            resume_text_parts
        ).strip()

        if not resume_text:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Could not extract text from this PDF. "
                    "Please upload a text-based PDF rather than a scanned image."
                )
            )

        skills = detect_skills(
            resume_text
        )

        skill_score = calculate_skill_score(
            skills
        )

        section_score = calculate_section_score(
            resume_text
        )

        content_score = calculate_content_score(
            resume_text
        )

        role_match = calculate_role_match(
            skills,
            target_role
        )

        ats_score = calculate_ats_score(
            skill_score,
            section_score,
            content_score,
            role_match
        )

        missing_skills = get_missing_skills(
            skills,
            target_role
        )

        suggestions = generate_suggestions(
            resume_text,
            skills,
            missing_skills,
            ats_score
        )

        sections = get_resume_sections(
            resume_text
        )

        return {
            "success": True,
            "filename": file.filename,
            "pages": len(pdf.pages),
            "word_count": len(
                resume_text.split()
            ),
            "target_role": target_role,
            "ats_score": ats_score,
            "skill_score": skill_score,
            "section_score": section_score,
            "content_score": content_score,
            "role_match": role_match,
            "skills": skills,
            "missing_skills": missing_skills,
            "suggestions": suggestions,
            "sections": sections,

            # Important:
            # The frontend needs this text for Job Matching.
            "resume_text": resume_text
        }

    except HTTPException:
        raise

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=(
                "Resume processing failed: "
                + str(error)
            )
        )


# =========================================================
# JOB DESCRIPTION MATCHER
# =========================================================

@router.post("/job-match")
async def job_match(
    data: JobMatchRequest
):

    if not data.resume_text.strip():

        raise HTTPException(
            status_code=400,
            detail="Resume text is missing. Analyze your resume first."
        )

    if not data.job_description.strip():

        raise HTTPException(
            status_code=400,
            detail="Please paste a job description."
        )

    resume_skills = detect_skills(
        data.resume_text
    )

    job_skills = detect_skills(
        data.job_description
    )

    resume_skill_set = {
        skill.lower()
        for skill in resume_skills
    }

    job_skill_set = {
        skill.lower()
        for skill in job_skills
    }

    matched_skills = []

    for skill in job_skills:

        if skill.lower() in resume_skill_set:

            matched_skills.append(skill)

    missing_skills = []

    for skill in job_skills:

        if skill.lower() not in resume_skill_set:

            missing_skills.append(skill)

    # If the job description has detectable skills,
    # calculate match from those skills.
    if job_skill_set:

        match_score = round(
            len(matched_skills)
            / len(job_skills)
            * 100
        )

    else:

        # If no known technical skills were detected,
        # give a neutral result rather than falsely saying 0%.
        match_score = 50

    # Role-specific skills can also be considered.
    role_key = data.target_role.strip().lower()

    role_required = ROLE_SKILLS.get(
        role_key,
        []
    )

    role_missing = []

    for skill in role_required:

        display_name = DISPLAY_NAMES.get(
            skill,
            skill.title()
        )

        if (
            display_name.lower()
            not in resume_skill_set
            and display_name not in missing_skills
        ):
            role_missing.append(
                display_name
            )

    recommendations = []

    for skill in missing_skills[:5]:

        recommendations.append(
            f"Improve your {skill} skills and add a practical project demonstrating them."
        )

    if not recommendations:

        recommendations.append(
            "Your detected skills align well with this job description. Tailor your resume wording to the job requirements."
        )

    if match_score < 50:

        overall_message = (
            "Your resume currently has a low match with this job. "
            "Focus on the missing skills before applying."
        )

    elif match_score < 75:

        overall_message = (
            "Your resume has a moderate match. "
            "Adding the missing skills and relevant project experience can improve your chances."
        )

    elif match_score < 90:

        overall_message = (
            "Your resume is a strong match for this job. "
            "Tailor your resume keywords to the job description."
        )

    else:

        overall_message = (
            "Excellent match. Your detected skills align strongly with this job description."
        )

    return {
        "success": True,

        "target_role": data.target_role,

        "match_score": match_score,

        "matched_skills": matched_skills,

        "missing_skills": missing_skills,

        "role_missing_skills": role_missing,

        "recommendations": recommendations,

        "message": overall_message,

        "resume_skills": resume_skills,

        "job_skills": job_skills,

        "job_skill_count": len(job_skills),

        "matched_skill_count": len(
            matched_skills
        )
    }
# =========================================================
# AI RESUME IMPROVER
# =========================================================

class ResumeImproveRequest(BaseModel):
    resume_text: str
    job_description: str = ""
    target_role: str = "Software Developer"


def improve_bullet(sentence: str) -> str:
    """
    Converts a simple resume sentence into a stronger,
    achievement-oriented bullet.
    """

    sentence = sentence.strip()

    if not sentence:
        return ""

    # Remove common weak starting words
    weak_starts = [
        "worked on",
        "helped with",
        "responsible for",
        "did",
        "made",
        "created",
        "worked",
        "used"
    ]

    improved = sentence

    for phrase in weak_starts:

        if improved.lower().startswith(phrase):

            remaining = improved[len(phrase):].strip()

            if remaining:
                improved = (
                    "Developed and implemented "
                    + remaining[0].lower()
                    + remaining[1:]
                )

            break

    # Add stronger professional language
    if len(improved.split()) < 8:

        improved = (
            improved.rstrip(".")
            + ", focusing on performance, usability and maintainability."
        )

    return improved


def extract_resume_bullets(text: str) -> list[str]:

    lines = text.splitlines()

    bullets = []

    for line in lines:

        line = line.strip()

        if not line:
            continue

        if line.startswith(("•", "-", "*")):

            cleaned = line.lstrip("•-* ").strip()

            if len(cleaned.split()) >= 4:
                bullets.append(cleaned)

    return bullets[:8]


def generate_improved_summary(
    resume_text: str,
    target_role: str,
    skills: list[str]
) -> str:

    skill_text = ", ".join(skills[:7])

    if not skill_text:
        skill_text = "software development and problem solving"

    return (
        f"Motivated Computer Science professional targeting a "
        f"{target_role} role with experience in {skill_text}. "
        f"Strong foundation in software development, problem solving "
        f"and building practical technology solutions. "
        f"Passionate about developing reliable, user-focused applications "
        f"and continuously improving technical skills."
    )


def generate_keyword_recommendations(
    resume_text: str,
    job_description: str
) -> list[str]:

    if not job_description.strip():
        return []

    resume_skills = {
        skill.lower()
        for skill in detect_skills(resume_text)
    }

    job_skills = detect_skills(job_description)

    missing = []

    for skill in job_skills:

        if skill.lower() not in resume_skills:
            missing.append(skill)

    return missing[:8]


@router.post("/improve")
async def improve_resume(
    data: ResumeImproveRequest
):

    if not data.resume_text.strip():

        raise HTTPException(
            status_code=400,
            detail="Resume text is required."
        )

    skills = detect_skills(
        data.resume_text
    )

    # -----------------------------------------
    # Improved Summary
    # -----------------------------------------

    improved_summary = generate_improved_summary(
        data.resume_text,
        data.target_role,
        skills
    )

    # -----------------------------------------
    # Improved Bullet Points
    # -----------------------------------------

    original_bullets = extract_resume_bullets(
        data.resume_text
    )

    improved_bullets = []

    for bullet in original_bullets:

        improved = improve_bullet(
            bullet
        )

        if improved:

            improved_bullets.append({
                "original": bullet,
                "improved": improved
            })

    # -----------------------------------------
    # Job-specific Keywords
    # -----------------------------------------

    keywords_to_add = generate_keyword_recommendations(
        data.resume_text,
        data.job_description
    )

    # -----------------------------------------
    # General Recommendations
    # -----------------------------------------

    recommendations = []

    if "github" not in data.resume_text.lower():

        recommendations.append(
            "Add your GitHub profile and relevant repositories."
        )

    if "linkedin" not in data.resume_text.lower():

        recommendations.append(
            "Add your LinkedIn profile to improve recruiter visibility."
        )

    if "project" not in data.resume_text.lower():

        recommendations.append(
            "Add practical projects with technologies and measurable outcomes."
        )

    if keywords_to_add:

        recommendations.append(
            "Consider adding relevant job keywords only when you genuinely have those skills."
        )

    recommendations.append(
        "Use measurable results whenever possible, such as percentages, time saved, users served or performance improvements."
    )

    return {
        "success": True,

        "target_role": data.target_role,

        "improved_summary": improved_summary,

        "original_bullets": original_bullets,

        "improved_bullets": improved_bullets,

        "keywords_to_add": keywords_to_add,

        "recommendations": recommendations[:6]
    }