package com.resumeai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Data Transfer Object representing the complete AI analysis result.
 * Encapsulates all data returned to the frontend.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumeResponse {

    private int atsScore;                     // 0-100 ATS compatibility score
    private List<String> extractedSkills;     // Skills found in the resume
    private List<String> missingSkills;       // Key skills absent from resume
    private int jobMatchScore;                // % match with target role
    private List<String> suggestions;         // Actionable improvement tips
    private String jobRole;                   // Matched or target job role
    private String analysisStatus;            // SUCCESS / PARTIAL / FAILED
    private String rawAiResponse;             // Full LLM response (for debugging)
}
