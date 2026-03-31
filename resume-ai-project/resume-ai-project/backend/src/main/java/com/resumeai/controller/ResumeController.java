package com.resumeai.controller;

import com.resumeai.dto.ResumeRequest;
import com.resumeai.dto.ResumeResponse;
import com.resumeai.service.ResumeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * REST Controller exposing all resume-related API endpoints.
 *
 * Base URL: /api/resume
 *
 * Endpoints:
 *   POST /upload  → Extract text from PDF
 *   POST /analyze → Full AI-powered analysis
 *   POST /full    → Upload + Analyze in one step (convenience endpoint)
 *   GET  /health  → Health check
 */
@Slf4j
@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ResumeController {

    private final ResumeService resumeService;

    /**
     * Health check endpoint.
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Resume Analyzer API is running ✅");
    }

    /**
     * Accepts a PDF file and returns the extracted raw text.
     * Useful for preview or pre-processing before analysis.
     */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> uploadResume(@RequestParam("file") MultipartFile file) {
        log.info("PDF upload request received: {}", file.getOriginalFilename());

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("File is empty. Please upload a valid PDF.");
        }

        String extractedText = resumeService.extractTextFromPdf(file);
        return ResponseEntity.ok(extractedText);
    }

    /**
     * Analyzes resume text using the LLM AI service.
     * Accepts JSON with resumeText and optional jobRole.
     */
    @PostMapping("/analyze")
    public ResponseEntity<ResumeResponse> analyzeResume(@Valid @RequestBody ResumeRequest request) {
        log.info("Analysis request for job role: {}", request.getJobRole());

        ResumeResponse response = resumeService.analyzeResume(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Convenience endpoint: upload PDF and analyze in a single call.
     * Accepts multipart form with 'file' and optional 'jobRole'.
     */
    @PostMapping(value = "/full-analysis", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResumeResponse> fullAnalysis(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "jobRole", required = false, defaultValue = "Software Engineer") String jobRole) {

        log.info("Full analysis requested for: {} targeting role: {}", file.getOriginalFilename(), jobRole);

        // Step 1: Extract text
        String extractedText = resumeService.extractTextFromPdf(file);

        // Step 2: Analyze with AI
        ResumeRequest request = ResumeRequest.builder()
                .resumeText(extractedText)
                .jobRole(jobRole)
                .build();

        ResumeResponse response = resumeService.analyzeResume(request);
        return ResponseEntity.ok(response);
    }
}
