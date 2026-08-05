package com.mandalink.api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class EmailService {

    @Value("${app.resend.api-key:}")
    private String resendApiKey;

    @Value("${app.resend.from-email:onboarding@resend.dev}")
    private String fromEmail;

    public boolean isConfigured() {
        return resendApiKey != null && !resendApiKey.isBlank();
    }

    public boolean sendPasswordResetEmail(String toEmail, String username, String resetLink) {
        if (!isConfigured()) {
            return false;
        }
        try {
            RestClient client = RestClient.create();
            String html = "<p>Hi " + username + ",</p>"
                + "<p>Someone requested a password reset for your Mandalink account. "
                + "If this was you, click the link below to set a new password:</p>"
                + "<p><a href=\"" + resetLink + "\">" + resetLink + "</a></p>"
                + "<p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>";

            client.post()
                .uri("https://api.resend.com/emails")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + resendApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                    "from", "Mandalink <" + fromEmail + ">",
                    "to", new String[]{toEmail},
                    "subject", "Reset your Mandalink password",
                    "html", html
                ))
                .retrieve()
                .toBodilessEntity();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean sendUsernameEmail(String toEmail, String username) {
        if (!isConfigured()) {
            return false;
        }
        try {
            RestClient client = RestClient.create();
            String html = "<p>Hi there,</p>"
                + "<p>You asked us to remind you of your Mandalink username. It's:</p>"
                + "<p><strong>" + username + "</strong></p>"
                + "<p>If you didn't request this, you can ignore this email.</p>";

            client.post()
                .uri("https://api.resend.com/emails")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + resendApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                    "from", "Mandalink <" + fromEmail + ">",
                    "to", new String[]{toEmail},
                    "subject", "Your Mandalink username",
                    "html", html
                ))
                .retrieve()
                .toBodilessEntity();
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean sendSupportRequestEmail(String fromUserEmail) {
        if (!isConfigured()) {
            return false;
        }
        try {
            RestClient client = RestClient.create();
            String html = "<p>New support request from Mandalink.</p>"
                + "<p>User's email: <strong>" + fromUserEmail + "</strong></p>"
                + "<p>Reply directly to this address to get back to them.</p>";

            client.post()
                .uri("https://api.resend.com/emails")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + resendApiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of(
                    "from", "Mandalink <" + fromEmail + ">",
                    "to", new String[]{"mandalinksupport@gmail.com"},
                    "reply_to", fromUserEmail,
                    "subject", "New Mandalink support request",
                    "html", html
                ))
                .retrieve()
                .toBodilessEntity();
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
