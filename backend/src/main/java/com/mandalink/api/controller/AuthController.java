package com.mandalink.api.controller;

import com.mandalink.api.dto.AuthDtos.*;
import com.mandalink.api.model.User;
import com.mandalink.api.repository.UserRepository;
import com.mandalink.api.service.EmailService;
import com.mandalink.api.service.JwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    @Value("${app.frontend-base-url:https://mandalink.org}")
    private String frontendBaseUrl;

    @Value("${app.google.client-id:}")
    private String googleClientId;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder,
                           JwtService jwtService, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest req) {
        if (req.username() == null || req.username().isBlank()
                || req.email() == null || req.email().isBlank()
                || req.password() == null || req.password().isBlank()) {
            return new AuthResponse(false, "All fields are required", null, null);
        }
        if (req.password().length() < 4) {
            return new AuthResponse(false, "Password must be at least 4 characters", null, null);
        }
        if (userRepository.existsByUsername(req.username())) {
            return new AuthResponse(false, "Username already exists", null, null);
        }
        if (userRepository.existsByEmail(req.email())) {
            return new AuthResponse(false, "Email already exists", null, null);
        }

        User user = new User();
        user.setUsername(req.username());
        user.setEmail(req.email());
        user.setPasswordHash(passwordEncoder.encode(req.password()));
        user.setXp(0);
        user.setLevel(1);
        userRepository.save(user);

        String token = jwtService.generateToken(user.getUsername());
        return new AuthResponse(true, "Account created", token,
                new UserSummary(user.getId(), user.getUsername(), user.getXp(), user.getLevel()));
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest req) {
        var userOpt = userRepository.findByUsername(req.username());
        if (userOpt.isEmpty() || !passwordEncoder.matches(req.password(), userOpt.get().getPasswordHash())) {
            return new AuthResponse(false, "Invalid username or password", null, null);
        }
        User user = userOpt.get();
        String token = jwtService.generateToken(user.getUsername());
        return new AuthResponse(true, "Login successful", token,
                new UserSummary(user.getId(), user.getUsername(), user.getXp(), user.getLevel()));
    }

    @PostMapping("/forgot-password")
    public ForgotPasswordResponse forgotPassword(@RequestBody ForgotPasswordRequest req) {
        if (req.email() == null || req.email().isBlank()) {
            return new ForgotPasswordResponse(false, "Enter the email on your account.", null);
        }

        var userOpt = userRepository.findByEmail(req.email());
        if (userOpt.isEmpty()) {
            // Don't reveal whether the email exists — same message either way
            return new ForgotPasswordResponse(true,
                "If that email is on an account, a reset link has been sent.", null);
        }

        User user = userOpt.get();
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        String resetLink = frontendBaseUrl + "/reset-password?token=" + token;
        boolean emailed = emailService.sendPasswordResetEmail(user.getEmail(), user.getUsername(), resetLink);

        if (emailed) {
            return new ForgotPasswordResponse(true,
                "If that email is on an account, a reset link has been sent.", null);
        } else {
            // Email not configured or failed — fall back to returning the link directly
            return new ForgotPasswordResponse(true,
                "Email isn't configured yet — use this link directly to reset your password.", resetLink);
        }
    }

    @PostMapping("/reset-password")
    public ResetPasswordResponse resetPassword(@RequestBody ResetPasswordRequest req) {
        if (req.token() == null || req.token().isBlank()) {
            return new ResetPasswordResponse(false, "Missing reset token.");
        }
        if (req.newPassword() == null || req.newPassword().length() < 4) {
            return new ResetPasswordResponse(false, "Password must be at least 4 characters.");
        }

        var userOpt = userRepository.findByResetToken(req.token());
        if (userOpt.isEmpty()) {
            return new ResetPasswordResponse(false, "This reset link is invalid or already used.");
        }

        User user = userOpt.get();
        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return new ResetPasswordResponse(false, "This reset link has expired. Request a new one.");
        }

        user.setPasswordHash(passwordEncoder.encode(req.newPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return new ResetPasswordResponse(true, "Password reset. You can now log in with your new password.");
    }

    @PostMapping("/reset-password-direct")
    public DirectResetResponse resetPasswordDirect(@RequestBody DirectResetRequest req) {
        if (req.username() == null || req.username().isBlank()
                || req.email() == null || req.email().isBlank()) {
            return new DirectResetResponse(false, "Enter your username and email.");
        }
        if (req.newPassword() == null || req.newPassword().length() < 4) {
            return new DirectResetResponse(false, "Password must be at least 4 characters.");
        }

        var userOpt = userRepository.findByUsernameAndEmail(req.username(), req.email());
        if (userOpt.isEmpty()) {
            return new DirectResetResponse(false, "No account found with that username and email.");
        }

        User user = userOpt.get();
        user.setPasswordHash(passwordEncoder.encode(req.newPassword()));
        userRepository.save(user);

        return new DirectResetResponse(true, "Password reset. You can now log in with your new password.");
    }

    @PostMapping("/google")
    public AuthResponse googleAuth(@RequestBody GoogleAuthRequest req) {
        if (googleClientId == null || googleClientId.isBlank()) {
            return new AuthResponse(false, "Google Sign-In isn't configured yet.", null, null);
        }
        if (req.idToken() == null || req.idToken().isBlank()) {
            return new AuthResponse(false, "Missing Google credential.", null, null);
        }

        Map<?, ?> tokenInfo;
        try {
            RestClient client = RestClient.create();
            tokenInfo = client.get()
                .uri("https://oauth2.googleapis.com/tokeninfo?id_token=" + req.idToken())
                .retrieve()
                .body(Map.class);
        } catch (Exception e) {
            return new AuthResponse(false, "Could not verify Google credential.", null, null);
        }

        if (tokenInfo == null) {
            return new AuthResponse(false, "Could not verify Google credential.", null, null);
        }

        String aud = (String) tokenInfo.get("aud");
        String emailVerified = (String) tokenInfo.get("email_verified");
        String email = (String) tokenInfo.get("email");
        String name = (String) tokenInfo.get("name");

        if (!googleClientId.equals(aud)) {
            return new AuthResponse(false, "Google credential was not issued for this app.", null, null);
        }
        if (!"true".equals(emailVerified) || email == null) {
            return new AuthResponse(false, "Google account email is not verified.", null, null);
        }

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            String baseUsername = (name != null && !name.isBlank())
                ? name.replaceAll("\\s+", "").toLowerCase()
                : email.split("@")[0];
            String candidate = baseUsername;
            int suffix = 1;
            while (userRepository.existsByUsername(candidate)) {
                candidate = baseUsername + suffix;
                suffix++;
            }

            user = new User();
            user.setUsername(candidate);
            user.setEmail(email);
            user.setPasswordHash(passwordEncoder.encode(UUID.randomUUID().toString()));
            user.setAuthProvider("google");
            user.setXp(0);
            user.setLevel(1);
            userRepository.save(user);
        }

        String token = jwtService.generateToken(user.getUsername());
        return new AuthResponse(true, "Signed in with Google", token,
                new UserSummary(user.getId(), user.getUsername(), user.getXp(), user.getLevel()));
    }

    @PostMapping("/forgot-username")
    public ForgotUsernameResponse forgotUsername(@RequestBody ForgotUsernameRequest req) {
        if (req.email() == null || req.email().isBlank()) {
            return new ForgotUsernameResponse(false, "Enter your account email.", null);
        }

        var userOpt = userRepository.findByEmail(req.email());
        if (userOpt.isEmpty()) {
            // Don't reveal whether the email exists
            return new ForgotUsernameResponse(true,
                "If that email is on an account, we've sent the username to it.", null);
        }

        User user = userOpt.get();
        boolean emailed = emailService.sendUsernameEmail(user.getEmail(), user.getUsername());

        if (emailed) {
            return new ForgotUsernameResponse(true,
                "If that email is on an account, we've sent the username to it.", null);
        } else {
            return new ForgotUsernameResponse(true,
                "Email isn't configured yet — here's your username directly.", user.getUsername());
        }
    }
}
