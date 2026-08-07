package com.mandalink.api.controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.mandalink.api.model.BadgeDrop;
import com.mandalink.api.model.User;
import com.mandalink.api.repository.BadgeClaimRepository;
import com.mandalink.api.repository.BadgeDropRepository;
import com.mandalink.api.repository.PageViewRepository;
import com.mandalink.api.repository.RadicalRepository;
import com.mandalink.api.repository.UserRepository;
import com.mandalink.api.service.JwtService;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final RadicalRepository radicalRepository;
    private final PageViewRepository pageViewRepository;
    private final BadgeDropRepository badgeDropRepository;
    private final BadgeClaimRepository badgeClaimRepository;
    private final JwtService jwtService;

    public AdminController(UserRepository userRepository, RadicalRepository radicalRepository,
                            PageViewRepository pageViewRepository, BadgeDropRepository badgeDropRepository,
                            BadgeClaimRepository badgeClaimRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.radicalRepository = radicalRepository;
        this.pageViewRepository = pageViewRepository;
        this.badgeDropRepository = badgeDropRepository;
        this.badgeClaimRepository = badgeClaimRepository;
        this.jwtService = jwtService;
    }

    public record AdminUserRow(Long id, String username, String email, Integer xp, Integer level,
                                String authProvider, LocalDateTime createdAt, @JsonProperty("isAdmin") Boolean isAdmin) {}

    public record PagePopularity(String path, Long views) {}

    public record ActiveDropInfo(Long id, String name, String icon, String description, LocalDateTime expiresAt) {}

    public record AdminStatsResponse(boolean authorized, String message, Long totalUsers,
                                      Long totalRadicals, List<AdminUserRow> users,
                                      Long activeUsers24h, Long activeUsers7d, Long totalPageViews,
                                      List<PagePopularity> topPages, ActiveDropInfo activeDrop) {}

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
            return new AdminStatsResponse(false, "Not authorized.", null, null, null, null, null, null, null, null);
        }

        List<AdminUserRow> rows = userRepository.findAll().stream()
            .map(u -> new AdminUserRow(
                u.getId(), u.getUsername(), u.getEmail(), u.getXp(), u.getLevel(),
                u.getAuthProvider(), u.getCreatedAt(), u.getIsAdmin()))
            .toList();

        LocalDateTime now = LocalDateTime.now();
        long active24h = pageViewRepository.countDistinctActiveSince(now.minusHours(24));
        long active7d = pageViewRepository.countDistinctActiveSince(now.minusDays(7));
        long totalViews = pageViewRepository.count();
        List<PagePopularity> topPages = pageViewRepository.topPaths(PageRequest.of(0, 8)).stream()
            .map(p -> new PagePopularity(p.getPath(), p.getCnt()))
            .toList();

        ActiveDropInfo activeDrop = badgeDropRepository.findActive(now)
            .map(d -> new ActiveDropInfo(d.getId(), d.getName(), d.getIcon(), d.getDescription(), d.getExpiresAt()))
            .orElse(null);

        return new AdminStatsResponse(true, "OK", (long) rows.size(), radicalRepository.count(), rows,
            active24h, active7d, totalViews, topPages, activeDrop);
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

    public record CreateDropRequest(String name, String icon, String description) {}
    public record CreateDropResponse(boolean success, String message) {}

    @PostMapping("/badge-drops")
    public CreateDropResponse createDrop(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                          @RequestBody CreateDropRequest req) {
        User admin = verifyAdmin(authHeader);
        if (admin == null) {
            return new CreateDropResponse(false, "Not authorized.");
        }
        if (req.name() == null || req.name().isBlank() || req.icon() == null || req.icon().isBlank()) {
            return new CreateDropResponse(false, "Name and icon are required.");
        }
        LocalDateTime now = LocalDateTime.now();
        if (badgeDropRepository.findActive(now).isPresent()) {
            return new CreateDropResponse(false, "There's already an active drop — end it first or wait for it to expire.");
        }

        BadgeDrop drop = new BadgeDrop();
        drop.setName(req.name().trim());
        drop.setIcon(req.icon().trim());
        drop.setDescription(req.description() == null ? "" : req.description().trim());
        drop.setCreatedAt(now);
        drop.setExpiresAt(now.plusHours(24));
        badgeDropRepository.save(drop);

        return new CreateDropResponse(true, "Drop created — live for 24 hours.");
    }

    @PostMapping("/badge-drops/end")
    public CreateDropResponse endDrop(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        User admin = verifyAdmin(authHeader);
        if (admin == null) {
            return new CreateDropResponse(false, "Not authorized.");
        }
        var activeOpt = badgeDropRepository.findActive(LocalDateTime.now());
        if (activeOpt.isEmpty()) {
            return new CreateDropResponse(false, "No active drop to end.");
        }
        BadgeDrop drop = activeOpt.get();
        drop.setExpiresAt(LocalDateTime.now());
        badgeDropRepository.save(drop);
        return new CreateDropResponse(true, "Drop ended early.");
    }

    public record DeleteUserResponse(boolean success, String message) {}

    @DeleteMapping("/users/{userId}")
    public DeleteUserResponse deleteUser(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                          @PathVariable Long userId) {
        User caller = verifyAdmin(authHeader);
        if (caller == null) {
            return new DeleteUserResponse(false, "Not authorized.");
        }
        if (caller.getId().equals(userId)) {
            return new DeleteUserResponse(false, "You can't delete your own account from here.");
        }
        var targetOpt = userRepository.findById(userId);
        if (targetOpt.isEmpty()) {
            return new DeleteUserResponse(false, "User not found.");
        }
        User target = targetOpt.get();
        String deletedUsername = target.getUsername();

        // Clean up related data first — no real FK constraint would enforce
        // this, so do it explicitly to avoid orphaned rows.
        badgeClaimRepository.deleteByUserId(userId);
        userRepository.delete(target);

        return new DeleteUserResponse(true, "Deleted account: " + deletedUsername);
    }
}
