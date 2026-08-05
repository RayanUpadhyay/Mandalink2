package com.mandalink.api.dto;

public class AuthDtos {

    public record RegisterRequest(String username, String email, String password) {}
    public record LoginRequest(String username, String password) {}

    public record AuthResponse(boolean success, String message, String token, UserSummary user) {}

    public record UserSummary(Long id, String username, Integer xp, Integer level) {}

    public record XpUpdateRequest(Integer amount) {}
}
