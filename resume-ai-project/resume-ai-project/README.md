# 🚀 AI-Powered Resume Analyzer & Job Matcher

<div align="center">

![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=java&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?style=for-the-badge&logo=openai&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**An enterprise-grade Generative AI system for intelligent resume evaluation, ATS scoring, and smart job matching.**

[Live Demo](#) · [API Docs](#api-documentation) · [Report Bug](issues) · [Request Feature](issues)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

The AI-Powered Resume Analyzer & Job Matcher is a **production-grade full-stack GenAI system** that automates the entire resume evaluation pipeline. Built with a clean **3-tier architecture**, it combines:

- 🔵 **Java Spring Boot** — robust, enterprise-grade REST API layer
- 🐍 **Python Flask + LLM** — intelligent AI analysis engine
- ⚛️ **React 18** — stunning animated UI with real-time feedback

### What It Does
| Feature | Description |
|---|---|
| 📄 Resume Upload | PDF parsing with Apache PDFBox |
| 🤖 AI Analysis | GPT-4 powered skill extraction & gap analysis |
| 📊 ATS Score | Keyword-based ATS compatibility score (0–100) |
| 🎯 Job Matching | Semantic similarity matching with job roles |
| 💡 Suggestions | Actionable improvement recommendations |
| 📥 Export | Download AI-enhanced resume as PDF |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React Frontend                     │
│         (Animated UI + Real-time Updates)            │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP / REST
┌──────────────────────▼──────────────────────────────┐
│              Spring Boot Backend (Java)              │
│   Controller → Service → DTO → Exception Handler    │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP / Internal
┌──────────────────────▼──────────────────────────────┐
│            Python AI Service (Flask)                 │
│         LLM Prompt Engine → OpenAI GPT-4            │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend (Java)
- **Java 17** + **Spring Boot 3.2**
- **Apache PDFBox 3.0** — PDF text extraction
- **RestTemplate** — microservice communication
- **Maven** — dependency management
- **Lombok** — boilerplate reduction

### AI Layer (Python)
- **Python 3.11** + **Flask 3.0**
- **OpenAI GPT-4** — LLM analysis
- **LangChain** — prompt orchestration
- **Flask-CORS** — cross-origin support

### Frontend (React)
- **React 18** + **Vite**
- **Framer Motion** — animations
- **Axios** — HTTP client
- **React Dropzone** — file upload
- **Recharts** — data visualization
- **Tailwind CSS** — utility styling

---

## 📁 Project Structure

```
resume-ai-project/
├── 📁 backend/                    # Java Spring Boot
│   ├── src/main/java/com/resumeai/
│   │   ├── controller/            # REST API endpoints
│   │   │   └── ResumeController.java
│   │   ├── service/               # Business logic
│   │   │   └── ResumeService.java
│   │   ├── dto/                   # Data transfer objects
│   │   │   ├── ResumeRequest.java
│   │   │   ├── ResumeResponse.java
│   │   │   └── JobMatchResponse.java
│   │   ├── exception/             # Global error handling
│   │   │   └── GlobalExceptionHandler.java
│   │   └── config/                # App configuration
│   │       └── CorsConfig.java
│   ├── src/main/resources/
│   │   └── application.yml
│   └── pom.xml
│
├── 📁 ai-service/                 # Python Flask + LLM
│   ├── app.py                     # Main Flask application
│   ├── prompt_engine.py           # Prompt templates
│   ├── requirements.txt
│   └── .env.example
│
├── 📁 frontend/                   # React 18 + Animations
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── ResumeUploader.jsx
│   │   │   ├── AnalysisResult.jsx
│   │   │   ├── ATSScoreRing.jsx
│   │   │   ├── SkillsChart.jsx
│   │   │   └── JobMatchCard.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── hooks/
│   │   │   └── useResumeAnalysis.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── 📁 docs/                       # Documentation
│   └── API.md
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Python 3.11+
- Node.js 18+
- OpenAI API Key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/resume-ai-analyzer.git
cd resume-ai-analyzer
```

### 2. Start the Python AI Service
```bash
cd ai-service
pip install -r requirements.txt
cp .env.example .env
# Add your OPENAI_API_KEY to .env
python app.py
# Runs on http://localhost:5000
```

### 3. Start the Spring Boot Backend
```bash
cd backend
./mvnw spring-boot:run
# Runs on http://localhost:8080
```

### 4. Start the React Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

---

## 📡 API Documentation

### Upload & Analyze Resume
```http
POST /api/resume/upload
Content-Type: multipart/form-data

file: <PDF file>
```

### Analyze Resume Text
```http
POST /api/resume/analyze
Content-Type: application/json

{
  "resumeText": "John Doe, Software Engineer...",
  "jobRole": "Senior Java Developer"
}
```

### Response Schema
```json
{
  "atsScore": 78,
  "extractedSkills": ["Java", "Spring Boot", "AWS"],
  "missingSkills": ["Kubernetes", "GraphQL"],
  "jobMatchScore": 85,
  "suggestions": ["Add quantified achievements", "Include cloud certifications"],
  "jobRole": "Senior Java Developer",
  "analysisStatus": "SUCCESS"
}
```

---

## 🔐 Environment Variables

### AI Service (.env)
```
OPENAI_API_KEY=sk-your-key-here
FLASK_ENV=development
PORT=5000
```

### Backend (application.yml)
```yaml
ai:
  service:
    url: http://localhost:5000
```

---

## 🐳 Docker Deployment

```bash
# Build and run all services
docker-compose up --build

# Services:
# Frontend  → http://localhost:3000
# Backend   → http://localhost:8080
# AI Layer  → http://localhost:5000
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
Built with ❤️ by a Senior Java + GenAI Engineer | 15+ Years of Enterprise Experience
</div>
