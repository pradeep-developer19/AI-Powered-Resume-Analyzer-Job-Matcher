package com.resumeai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for incoming resume analysis requests.
 * Carries the raw resume text and optional target job role.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumeRequest {

    @NotBlank(message = "Resume text must not be empty")
    private String resumeText;

    private String jobRole;  // Optional: e.g., "Senior Java Developer"
}
