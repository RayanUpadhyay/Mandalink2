package com.mandalink.api.controller;

import com.mandalink.api.model.User;
import com.mandalink.api.repository.RadicalRepository;
import com.mandalink.api.repository.UserRepository;
import com.mandalink.api.service.JwtService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final RadicalRepository radicalRepository;
    private final JwtService jwtService;

    public AdminController(UserRepository userRepository, RadicalRepository radicalRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.radicalRepository = radicalRepository;
        this.jwtService = jwtService;
    }

    public record AdminUserRow(Long id, String username, String email, Integer xp, Integer level,
                                String authProvider, LocalDateTime createdAt, Boolean isAdmin) {}

    public record AdminStatsResponse(boolean authorized, String message, Long totalUsers,
                                      Long totalRadicals, List<AdminUserRow> users) {}

    // Verifies the caller's JWT is valid AND that the account it belongs to
    // actually has isAdmin=true — never trusts a client-supplied username.
    private User verifyAdmin(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        String token = authHeader.substring(7);
        if (!jwtService.isValid(token)) return null;
        String username = jwtService.extractUsername(token);
        return userRepository.findByUsername(username)
            .filter(u -> Boolean.TRUE.equals(u.getIsAdmin()))
            .orElse(null);
    }

    @GetMapping("/stats")
    public AdminStatsResponse stats(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        User admin = verifyAdmin(authHeader);
        if (admin == null) {
            return new AdminStatsResponse(false, "Not authorized.", null, null, null);
        }

        List<AdminUserRow> rows = userRepository.findAll().stream()
            .map(u -> new AdminUserRow(
                u.getId(), u.getUsername(), u.getEmail(), u.getXp(), u.getLevel(),
                u.getAuthProvider(), u.getCreatedAt(), u.getIsAdmin()))
            .toList();

        return new AdminStatsResponse(true, "OK", (long) rows.size(), radicalRepository.count(), rows);
    }

    public record SetAdminRequest(Long userId, boolean isAdmin) {}
    public record SetAdminResponse(boolean success, String message) {}

    @PostMapping("/set-admin")
    public SetAdminResponse setAdmin(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                      @RequestBody SetAdminRequest req) {
        User caller = verifyAdmin(authHeader);
        if (caller == null) {
            return new SetAdminResponse(false, "Not authorized.");
        }
        var targetOpt = userRepository.findById(req.userId());
        if (targetOpt.isEmpty()) {
            return new SetAdminResponse(false, "User not found.");
        }
        User target = targetOpt.get();
        if (target.getId().equals(caller.getId()) && !req.isAdmin()) {
            return new SetAdminResponse(false, "You can't remove your own admin access.");
        }
        target.setIsAdmin(req.isAdmin());
        userRepository.save(target);
        return new SetAdminResponse(true, req.isAdmin()
            ? target.getUsername() + " is now an admin."
            : target.getUsername() + " is no longer an admin.");
    }
}
