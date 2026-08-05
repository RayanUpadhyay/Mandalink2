package com.mandalink.api.dto;

public class AuthDtos {

    public record RegisterRequest(String username, String email, String password) {}
    public record LoginRequest(String username, String password) {}

    public record AuthResponse(boolean success, String message, String token, UserSummary user) {}

    public record UserSummary(Long id, String username, Integer xp, Integer level) {}

    public record XpUpdateRequest(Integer amount) {}

    public record ForgotPasswordRequest(String email) {}
    public record ForgotPasswordResponse(boolean success, String message, String directResetLink) {}

    public record ResetPasswordRequest(String token, String newPassword) {}
    public record ResetPasswordResponse(boolean success, String message) {}

    public record DirectResetRequest(String username, String email, String newPassword) {}
    public record DirectResetResponse(boolean success, String message) {}
}
