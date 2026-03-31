"""
Prompt Engineering Module — The brain of the AI analysis pipeline.

This module defines carefully crafted prompts that instruct the LLM
to return structured, consistent JSON output for all analysis types.
"""


def build_analysis_prompt(resume_text: str, job_role: str) -> str:
    """
    Constructs the master prompt for comprehensive resume analysis.
    Uses chain-of-thought style instructions for best LLM output quality.
    """
    return f"""You are an expert ATS (Applicant Tracking System) and career coach with 20+ years of experience 
in technical recruitment. Analyze the following resume for the role of "{job_role}".

Perform a thorough analysis and return ONLY a valid JSON object with this EXACT structure:

{{
  "atsScore": <integer 0-100>,
  "jobMatchScore": <integer 0-100>,
  "extractedSkills": ["skill1", "skill2", ...],
  "missingSkills": ["missing1", "missing2", ...],
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2", ...],
  "jobRole": "{job_role}",
  "analysisStatus": "SUCCESS",
  "rawAiResponse": "Brief professional summary of the candidate"
}}

Scoring criteria:
- atsScore: Based on keyword density, formatting quality, quantified achievements, action verbs, and relevant skills (0-100)
- jobMatchScore: Based on how well the resume skills align with typical requirements for "{job_role}" (0-100)
- extractedSkills: List ALL technical and soft skills found in the resume
- missingSkills: List important skills for "{job_role}" that are absent from the resume (max 8)
- suggestions: Provide 5-7 specific, actionable improvements (be concrete and helpful)

Resume Text:
---
{resume_text}
---

Return ONLY the JSON object. No explanations, no markdown, no code blocks."""


def build_job_match_prompt(resume_text: str, job_description: str) -> str:
    """
    Constructs a prompt for comparing a resume against a specific job description.
    """
    return f"""You are a technical recruiter. Compare this resume against the job description below.

Return ONLY a valid JSON object:
{{
  "matchScore": <integer 0-100>,
  "matchingKeywords": ["keyword1", ...],
  "missingKeywords": ["keyword1", ...],
  "recommendation": "STRONG_MATCH | GOOD_FIT | PARTIAL_MATCH | NOT_SUITABLE",
  "summary": "One paragraph professional assessment"
}}

Resume:
---
{resume_text}
---

Job Description:
---
{job_description}
---

Return ONLY the JSON. No explanations."""
