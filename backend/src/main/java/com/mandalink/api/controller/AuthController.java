package com.mandalink.api.controller;

import com.mandalink.api.dto.AuthDtos.*;
import com.mandalink.api.model.User;
import com.mandalink.api.repository.UserRepository;
import com.mandalink.api.service.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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
}
