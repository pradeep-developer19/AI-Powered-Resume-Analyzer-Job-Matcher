package com.resumeai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.resumeai.dto.ResumeRequest;
import com.resumeai.dto.ResumeResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * Core service layer handling PDF parsing and AI orchestration.
 *
 * Responsibilities:
 * - PDF text extraction via Apache PDFBox
 * - Communicating with the Python AI microservice
 * - Parsing and mapping AI responses to typed DTOs
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ResumeService {

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    /**
     * Extracts plain text content from an uploaded PDF file.
     *
     * @param file the uploaded PDF as a MultipartFile
     * @return extracted text content
     * @throws RuntimeException if the PDF cannot be read or parsed
     */
    public String extractTextFromPdf(MultipartFile file) {
        log.info("Extracting text from PDF: {}, size: {} bytes",
                file.getOriginalFilename(), file.getSize());

        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            String text = stripper.getText(document);
            log.debug("Extracted {} characters from PDF", text.length());
            return text;
        } catch (IOException e) {
            log.error("Failed to extract text from PDF: {}", e.getMessage());
            throw new RuntimeException("Failed to parse PDF. Ensure the file is not corrupted or password-protected.", e);
        }
    }

    /**
     * Sends resume text to the AI service for full LLM-based analysis.
     *
     * @param request contains resume text and optional target job role
     * @return structured analysis result from the AI layer
     */
    public ResumeResponse analyzeResume(ResumeRequest request) {
        log.info("Sending resume for AI analysis. Job role: {}", request.getJobRole());

        String endpoint = aiServiceUrl + "/analyze";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        HttpEntity<ResumeRequest> httpRequest = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<ResumeResponse> response =
                    restTemplate.postForEntity(endpoint, httpRequest, ResumeResponse.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                log.info("AI analysis completed. ATS Score: {}", response.getBody().getAtsScore());
                return response.getBody();
            }

            log.warn("AI service returned unexpected status: {}", response.getStatusCode());
            return fallbackResponse("AI service returned an unexpected response.");

        } catch (Exception e) {
            log.error("Error calling AI service: {}", e.getMessage());
            throw new RuntimeException("AI analysis service is temporarily unavailable. Please try again shortly.", e);
        }
    }

    /**
     * Constructs a graceful fallback response when the AI layer fails.
     */
    private ResumeResponse fallbackResponse(String message) {
        return ResumeResponse.builder()
                .atsScore(0)
                .analysisStatus("FAILED")
                .suggestions(List.of(message))
                .extractedSkills(List.of())
                .missingSkills(List.of())
                .build();
    }
}
