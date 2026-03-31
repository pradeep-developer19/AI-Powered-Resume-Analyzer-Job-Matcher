# API Documentation

## Base URL
```
http://localhost:8080/api/resume
```

---

## Endpoints

### GET /health
Returns service health status.

**Response**
```
200 OK
"Resume Analyzer API is running ✅"
```

---

### POST /upload
Extracts text from an uploaded PDF resume.

**Request** — `multipart/form-data`
| Field | Type | Required |
|-------|------|----------|
| file  | PDF  | ✅ Yes    |

**Response** — `200 OK`
```
Plain text content of the resume
```

---

### POST /analyze
Runs full AI analysis on resume text.

**Request** — `application/json`
```json
{
  "resumeText": "John Doe, Java Developer...",
  "jobRole": "Senior Java Developer"
}
```

**Response** — `200 OK`
```json
{
  "atsScore": 78,
  "jobMatchScore": 85,
  "extractedSkills": ["Java", "Spring Boot", "Microservices", "AWS"],
  "missingSkills": ["Kubernetes", "GraphQL", "Kafka"],
  "suggestions": [
    "Add quantified achievements (e.g., 'Reduced latency by 40%')",
    "Include cloud certifications (AWS, GCP)",
    "Add a professional summary section"
  ],
  "jobRole": "Senior Java Developer",
  "analysisStatus": "SUCCESS",
  "rawAiResponse": "Experienced Java developer with strong Spring Boot background..."
}
```

---

### POST /full-analysis
Upload PDF and analyze in one request.

**Request** — `multipart/form-data`
| Field   | Type   | Required |
|---------|--------|----------|
| file    | PDF    | ✅ Yes    |
| jobRole | String | ❌ No (default: "Software Engineer") |

**Response** — Same as `/analyze`

---

## Error Responses

```json
{
  "statusCode": 400,
  "message": "Validation failed: resumeText must not be empty",
  "path": "/api/resume/analyze",
  "timestamp": "2024-01-15T10:30:00"
}
```

| Code | Meaning |
|------|---------|
| 400  | Bad request / validation error |
| 413  | File too large (> 10MB) |
| 500  | Server error / AI service unavailable |

---

## Python AI Service

### Base URL
```
http://localhost:5000
```

### GET /health
### POST /analyze — (called internally by Spring Boot)
### POST /job-match — Direct JD vs resume comparison
