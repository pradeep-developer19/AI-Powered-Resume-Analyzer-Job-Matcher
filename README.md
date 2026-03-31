# 🚀 AI-Powered Resume Analyzer & Job Matcher

## 📌 Overview
AI-Powered Resume Analyzer & Job Matcher is a full-stack Generative AI application that analyzes resumes, calculates ATS scores, and matches candidates with job roles using Large Language Models (LLMs). This project demonstrates real-world integration of backend systems with AI services.

---

## 🧠 Problem Statement
Most resumes get rejected by Applicant Tracking Systems (ATS) due to missing keywords, poor formatting, and lack of relevant skills. This project helps users improve their resumes by providing intelligent feedback and job matching insights.

---

## ✨ Key Features
- 📄 Resume Upload (PDF)
- 🤖 AI Resume Analysis
- 📊 ATS Score Calculation (0–100)
- 🎯 Job Match Score
- 🔍 Skill Gap Detection
- 💡 Resume Improvement Suggestions
- 📥 Download Improved Resume (Bonus Feature)

---

## 🏗️ System Architecture

Frontend (React)
↓
Backend (Spring Boot - Java)
↓
AI Service (Python Flask + LLM)
↓
Response Processing → UI Display

---

## ⚙️ How It Works
1. User uploads a resume (PDF)
2. Backend extracts text using PDF parsing
3. Extracted text is sent to AI service
4. AI analyzes the resume and generates:
   - Skills
   - Missing Skills
   - ATS Score
   - Job Match Score
   - Improvement Suggestions
5. Results are displayed on the frontend

---

## 🧠 AI Logic

### 🔹 ATS Score Calculation
The ATS score is calculated based on:
- Keyword matching
- Skill relevance
- Resume structure
- Industry-specific requirements

### 🔹 Job Matching Logic
- Compares resume skills with job requirements
- Calculates similarity score
- Suggests best-fit job roles

---

## 🛠️ Tech Stack

### Backend
- Java
- Spring Boot
- REST APIs

### AI Layer
- Python
- Flask
- OpenAI API / LLM

### Frontend
- React.js

### Tools
- Git & GitHub
- Postman
- Maven
- Docker (optional)

---

## 📁 Project Structure

project-root/
│
├── backend/         # Spring Boot application
├── ai-service/      # Python AI service
├── frontend/        # React frontend
├── docs/            # Project documentation (PDF)
└── README.md

---

## ▶️ Setup Instructions

### 🔹 1. Clone Repository
```bash
git clone https://github.com/your-username/AI-Powered-Resume-Analyzer-Job-Matcher.git
cd AI-Powered-Resume-Analyzer-Job-Matcher
```

---

### 🔹 2. Run Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```

---

### 🔹 3. Run AI Service (Python)
```bash
cd ai-service
pip install -r requirements.txt
python app.py
```

---

### 🔹 4. Run Frontend (React)
```bash
cd frontend
npm install
npm start
```

---

## 📸 Screenshots
<img width="1366" height="720" alt="Screenshot 2026-03-31 142952" src="https://github.com/user-attachments/assets/4ab2b2ca-6e9d-44b0-a621-3faee184d6a6" />
<img width="1366" height="768" alt="Screenshot 2026-03-31 143511" src="https://github.com/user-attachments/assets/4ac9b6ce-4308-428a-98df-ea18497e4152" />
<img width="1366" height="768" alt="Screenshot 2026-03-31 143556" src="https://github.com/user-attachments/assets/7eb440e3-a1d3-4b72-bdb0-f01545f20510" />





---

## 📄 Documentation
Full project documentation is available in the `/docs` folder.

---

## 🚀 Future Enhancements
- Local LLM integration (Ollama)
- Authentication system (Login/Register)
- Dashboard analytics
- Resume history tracking

---

## ⚠️ Limitations
- Depends on AI accuracy
- Requires internet for API calls
- API usage cost (if using paid LLM)

---

## 👨‍💻 Author
**Pradeep**

---

## ⭐ If you like this project
Give it a ⭐ on GitHub!
