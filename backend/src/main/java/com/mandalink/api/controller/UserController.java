package com.mandalink.api.controller;

import com.mandalink.api.dto.AuthDtos.ClaimedBadge;
import com.mandalink.api.model.User;
import com.mandalink.api.repository.UserRepository;
import com.mandalink.api.service.BadgeService;
import com.mandalink.api.service.JwtService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final BadgeService badgeService;
    private final JwtService jwtService;

    public UserController(UserRepository userRepository, BadgeService badgeService, JwtService jwtService) {
        this.userRepository = userRepository;
        this.badgeService = badgeService;
        this.jwtService = jwtService;
    }

    // Fixed, server-validated set of preset avatars — no free-text input accepted,
    // so there's no way to store arbitrary/unexpected values here.
    public static final Set<String> ALLOWED_AVATARS = Set.of(
        "panda", "tiger", "fox", "rabbit", "frog", "lion", "koala", "monkey",
        "owl", "dragon", "blossom", "star", "fire", "wave", "clover", "target"
    );

    private User userFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        String token = authHeader.substring(7);
        if (!jwtService.isValid(token)) return null;
        return userRepository.findByUsername(jwtService.extractUsername(token)).orElse(null);
    }

    public record ProfileResponse(boolean success, String message, Long id, String username, String email,
                                   Integer xp, Integer level, String avatar, Boolean isAdmin,
                                   Integer rank, Integer totalUsers, List<ClaimedBadge> badges,
                                   LocalDateTime createdAt) {}

    @GetMapping("/me")
    public ProfileResponse me(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        User user = userFromToken(authHeader);
        if (user == null) {
            return new ProfileResponse(false, "Not logged in.", null, null, null, null, null,
                null, null, null, null, null, null);
        }

        List<User> ranked = userRepository.findAllByOrderByXpDesc();
        int rank = 1;
        for (int i = 0; i < ranked.size(); i++) {
            if (ranked.get(i).getId().equals(user.getId())) {
                rank = i + 1;
                break;
            }
        }

        return new ProfileResponse(true, "OK", user.getId(), user.getUsername(), user.getEmail(),
            user.getXp(), user.getLevel(), user.getAvatar(), user.getIsAdmin(),
            rank, ranked.size(), badgeService.badgesFor(user), user.getCreatedAt());
    }

    // Public view of someone ELSE's profile — no auth required (same info
    // already visible on the leaderboard), but deliberately excludes email.
    public record PublicProfileResponse(boolean success, String message, String username, String avatar,
                                         Integer xp, Integer level, Boolean isAdmin,
                                         Integer rank, Integer totalUsers, List<ClaimedBadge> badges,
                                         LocalDateTime createdAt) {}

    @GetMapping("/profile/{username}")
    public PublicProfileResponse publicProfile(@PathVariable String username) {
        var userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return new PublicProfileResponse(false, "User not found.", null, null, null, null, null, null, null, null, null);
        }
        User user = userOpt.get();

        List<User> ranked = userRepository.findAllByOrderByXpDesc();
        int rank = 1;
        for (int i = 0; i < ranked.size(); i++) {
            if (ranked.get(i).getId().equals(user.getId())) {
                rank = i + 1;
                break;
            }
        }

        return new PublicProfileResponse(true, "OK", user.getUsername(), user.getAvatar(),
            user.getXp(), user.getLevel(), user.getIsAdmin(),
            rank, ranked.size(), badgeService.badgesFor(user), user.getCreatedAt());
    }

    public record ChangeUsernameRequest(String newUsername) {}
    public record ChangeUsernameResponse(boolean success, String message, String newToken) {}

    @PostMapping("/change-username")
    public ChangeUsernameResponse changeUsername(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                                   @RequestBody ChangeUsernameRequest req) {
        User user = userFromToken(authHeader);
        if (user == null) {
            return new ChangeUsernameResponse(false, "Not logged in.", null);
        }
        String newUsername = req.newUsername() == null ? "" : req.newUsername().trim();
        if (newUsername.length() < 3 || newUsername.length() > 20) {
            return new ChangeUsernameResponse(false, "Username must be 3-20 characters.", null);
        }
        if (!newUsername.matches("^[a-zA-Z0-9_]+$")) {
            return new ChangeUsernameResponse(false, "Username can only contain letters, numbers, and underscores.", null);
        }
        if (newUsername.equalsIgnoreCase(user.getUsername())) {
            return new ChangeUsernameResponse(false, "That's already your username.", null);
        }
        if (userRepository.existsByUsername(newUsername)) {
            return new ChangeUsernameResponse(false, "That username is already taken.", null);
        }

        user.setUsername(newUsername);
        userRepository.save(user);

        // The old JWT's subject is the old username — issue a fresh one so the
        // frontend can keep working without forcing a re-login.
        String newToken = jwtService.generateToken(newUsername);
        return new ChangeUsernameResponse(true, "Username updated.", newToken);
    }

    public record ChangeAvatarRequest(String avatar) {}
    public record ChangeAvatarResponse(boolean success, String message) {}

    @PostMapping("/change-avatar")
    public ChangeAvatarResponse changeAvatar(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                              @RequestBody ChangeAvatarRequest req) {
        User user = userFromToken(authHeader);
        if (user == null) {
            return new ChangeAvatarResponse(false, "Not logged in.");
        }
        if (req.avatar() == null || !ALLOWED_AVATARS.contains(req.avatar())) {
            return new ChangeAvatarResponse(false, "Not a valid avatar option.");
        }
        user.setAvatar(req.avatar());
        userRepository.save(user);
        return new ChangeAvatarResponse(true, "Avatar updated.");
    }
}
