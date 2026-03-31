package com.resumeai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Application-wide configuration beans.
 * Includes CORS setup and RestTemplate for inter-service communication.
 */
@Configuration
public class AppConfig implements WebMvcConfigurer {

    /**
     * Configures CORS for frontend development servers.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                        "http://localhost:3000",
                        "http://localhost:5173"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    /**
     * RestTemplate bean for calling the Python AI microservice.
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
