package com.mandalink.api.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiHelpController {

    @Value("${app.groq.api-key:}")
    private String groqApiKey;

    @Value("${app.groq.model:llama-3.1-8b-instant}")
    private String groqModel;

    public record ChatRequest(String message) {}
    public record ChatResponse(boolean success, String reply) {}

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest req) {
        if (groqApiKey == null || groqApiKey.isBlank()) {
            return new ChatResponse(false,
                "AI help isn't configured yet. Set the GROQ_API_KEY environment variable on the backend service.");
        }

        RestClient client = RestClient.create();

        String systemPrompt = "You are a friendly Mandarin Chinese radicals tutor for the Mandalink app. "
            + "Answer questions about Chinese radicals, their meanings, stroke order, and pronunciation. "
            + "Keep answers concise, encouraging, and beginner-friendly.";

        try {
            Map<String, Object> body = Map.of(
                "model", groqModel,
                "messages", List.of(
                    Map.of("role", "system", "content", systemPrompt),
                    Map.of("role", "user", "content", req.message())
                ),
                "temperature", 0.7
            );

            Map<?, ?> response = client.post()
                .uri("https://api.groq.com/openai/v1/chat/completions")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + groqApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(Map.class);

            List<?> choices = (List<?>) response.get("choices");
            Map<?, ?> firstChoice = (Map<?, ?>) choices.get(0);
            Map<?, ?> message = (Map<?, ?>) firstChoice.get("message");
            String reply = (String) message.get("content");

            return new ChatResponse(true, reply);
        } catch (Exception e) {
            return new ChatResponse(false, "Something went wrong reaching the AI tutor. Try again in a moment.");
        }
    }
}
