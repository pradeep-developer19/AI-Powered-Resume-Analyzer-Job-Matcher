"""
AI Service — Python Flask Application
Handles LLM-powered resume analysis via OpenAI GPT-4.

Architecture:
  Spring Boot → POST /analyze → This Flask App → OpenAI API → JSON Response
"""

import json
import logging
import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from openai import OpenAI

from prompt_engine import build_analysis_prompt, build_job_match_prompt

# ─── Setup ────────────────────────────────────────────────────────────────────
load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s - %(message)s"
)
logger = logging.getLogger("resume-ai-service")

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
MODEL = "gpt-4"

# ─── Routes ───────────────────────────────────────────────────────────────────

@app.route("/health", methods=["GET"])
def health():
    """Service health check."""
    return jsonify({"status": "ok", "service": "resume-ai-analyzer", "model": MODEL})


@app.route("/analyze", methods=["POST"])
def analyze_resume():
    """
    Main analysis endpoint called by Spring Boot.
    Accepts JSON with 'resumeText' and 'jobRole'.
    Returns structured analysis as JSON.
    """
    data = request.get_json()
    if not data:
        logger.warning("Empty request body received")
        return jsonify({"error": "Request body is required"}), 400

    resume_text = data.get("resumeText", "").strip()
    job_role = data.get("jobRole", "Software Engineer").strip()

    if not resume_text:
        return jsonify({"error": "resumeText is required"}), 400

    logger.info(f"Analyzing resume for role: {job_role} | text length: {len(resume_text)}")

    prompt = build_analysis_prompt(resume_text, job_role)

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert resume analyst and ATS specialist. "
                        "Always return valid, parseable JSON only. "
                        "Never include markdown, code fences, or explanations outside the JSON."
                    )
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,  # Low temperature for consistent, structured output
            max_tokens=1500
        )

        raw_content = response.choices[0].message.content.strip()
        logger.info(f"Raw LLM response received. Length: {len(raw_content)}")

        # Safely parse JSON from LLM output
        try:
            result = json.loads(raw_content)
        except json.JSONDecodeError:
            # Attempt to extract JSON from any surrounding text
            import re
            json_match = re.search(r'\{.*\}', raw_content, re.DOTALL)
            if json_match:
                result = json.loads(json_match.group())
            else:
                raise ValueError("LLM did not return valid JSON")

        logger.info(f"Analysis complete. ATS Score: {result.get('atsScore', 'N/A')}")
        return jsonify(result)

    except Exception as e:
        logger.error(f"LLM analysis error: {str(e)}", exc_info=True)
        return jsonify({
            "atsScore": 0,
            "jobMatchScore": 0,
            "extractedSkills": [],
            "missingSkills": [],
            "suggestions": ["AI analysis failed. Please try again."],
            "jobRole": job_role,
            "analysisStatus": "FAILED",
            "rawAiResponse": f"Error: {str(e)}"
        }), 500


@app.route("/job-match", methods=["POST"])
def job_match():
    """
    Compare a resume against a specific job description.
    """
    data = request.get_json()
    resume_text = data.get("resumeText", "")
    job_description = data.get("jobDescription", "")

    if not resume_text or not job_description:
        return jsonify({"error": "Both resumeText and jobDescription are required"}), 400

    prompt = build_job_match_prompt(resume_text, job_description)

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=800
        )
        result = json.loads(response.choices[0].message.content.strip())
        return jsonify(result)

    except Exception as e:
        logger.error(f"Job match error: {str(e)}")
        return jsonify({"error": str(e)}), 500


# ─── Entry Point ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV") == "development"
    logger.info(f"Starting AI service on port {port} | debug={debug}")
    app.run(host="0.0.0.0", port=port, debug=debug)
