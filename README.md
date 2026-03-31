# 🚀 AI-Powered Resume Analyzer & Job Matcher

## 📌 Overview
A full-stack Generative AI application that analyzes resumes, calculates ATS scores, and matches candidates with job roles using LLMs.

---

## 🧠 Key Features
- 📄 Resume Upload (PDF)
- 🤖 AI Resume Analysis
- 📊 ATS Score Calculation
- 🎯 Job Match Score
- 💡 Skill Gap Detection
- ✨ Improvement Suggestions

---

## 🏗️ Architecture

Frontend (React)
↓
Backend (Spring Boot)
↓
AI Service (Python + LLM)

---

## 🛠️ Tech Stack
- Java, Spring Boot
- Python, Flask
- React.js
- OpenAI API
- MySQL

---

## ⚙️ How It Works
1. Upload Resume
2. Extract Text
3. Send to AI Model
4. Generate:
   - Skills
   - Missing Skills
   - ATS Score
   - Suggestions
5. Display Results

---

## 🧠 AI Logic

### ATS Score
- Based on keyword matching
- Skill relevance
- Resume structure

### Job Matching
- Compare resume skills with job requirements
- Generate similarity score

---

## ▶️ Setup Instructions

### Backend
```bash
cd backend
mvn spring-boot:run
