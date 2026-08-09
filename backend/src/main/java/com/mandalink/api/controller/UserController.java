package com.mandalink.api.controller;

import com.mandalink.api.dto.AuthDtos.ClaimedBadge;
import com.mandalink.api.model.User;
import com.mandalink.api.repository.UserRepository;
import com.mandalink.api.service.BadgeService;
import com.mandalink.api.service.JwtService;
import com.mandalink.api.service.ModerationService;
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
    private final ModerationService moderationService;

    private static final int MAX_BIO_LENGTH = 300;
    // Data URI strings are ~33% larger than the raw image bytes they encode.
    // This caps the raw image at roughly 300KB.
    private static final int MAX_AVATAR_DATA_URI_LENGTH = 400_000;

    public UserController(UserRepository userRepository, BadgeService badgeService, JwtService jwtService,
                           ModerationService moderationService) {
        this.userRepository = userRepository;
        this.badgeService = badgeService;
        this.jwtService = jwtService;
        this.moderationService = moderationService;
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
                                   Integer xp, Integer level, String avatar, String avatarImage,
                                   Boolean hasPendingAvatar, String bio, Boolean isAdmin,
                                   Integer rank, Integer totalUsers, List<ClaimedBadge> badges,
                                   LocalDateTime createdAt) {}

    @GetMapping("/me")
    public ProfileResponse me(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        User user = userFromToken(authHeader);
        if (user == null) {
            return new ProfileResponse(false, "Not logged in.", null, null, null, null, null,
                null, null, null, null, null, null, null, null, null);
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
            user.getXp(), user.getLevel(), user.getAvatar(), user.getAvatarImage(),
            user.getPendingAvatarImage() != null, user.getBio(), user.getIsAdmin(),
            rank, ranked.size(), badgeService.badgesFor(user), user.getCreatedAt());
    }

    // Public view of someone ELSE's profile — no auth required (same info
    // already visible on the leaderboard), but deliberately excludes email
    // AND never exposes a pending (unapproved) image.
    public record PublicProfileResponse(boolean success, String message, String username, String avatar,
                                         String avatarImage, String bio, Integer xp, Integer level, Boolean isAdmin,
                                         Integer rank, Integer totalUsers, List<ClaimedBadge> badges,
                                         LocalDateTime createdAt) {}

    @GetMapping("/profile/{username}")
    public PublicProfileResponse publicProfile(@PathVariable String username) {
        var userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return new PublicProfileResponse(false, "User not found.", null, null, null, null, null, null, null, null, null, null, null);
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

        return new PublicProfileResponse(true, "OK", user.getUsername(), user.getAvatar(), user.getAvatarImage(),
            user.getBio(), user.getXp(), user.getLevel(), user.getIsAdmin(),
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
        var moderation = moderationService.checkText(newUsername);
        if (!moderation.allowed()) {
            return new ChangeUsernameResponse(false, "Please choose an appropriate username.", null);
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
        // Switching to a preset drops any approved custom photo — it's an
        // explicit choice to go back to presets, not just a display toggle.
        user.setAvatarImage(null);
        userRepository.save(user);
        return new ChangeAvatarResponse(true, "Avatar updated.");
    }

    public record UploadAvatarRequest(String imageDataUri) {}
    public record UploadAvatarResponse(boolean success, String message) {}

    @PostMapping("/upload-avatar")
    public UploadAvatarResponse uploadAvatar(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                              @RequestBody UploadAvatarRequest req) {
        User user = userFromToken(authHeader);
        if (user == null) {
            return new UploadAvatarResponse(false, "Not logged in.");
        }
        String dataUri = req.imageDataUri();
        if (dataUri == null || dataUri.isBlank()) {
            return new UploadAvatarResponse(false, "No image provided.");
        }
        if (!dataUri.startsWith("data:image/")) {
            return new UploadAvatarResponse(false, "That doesn't look like a valid image.");
        }
        if (dataUri.length() > MAX_AVATAR_DATA_URI_LENGTH) {
            return new UploadAvatarResponse(false, "Image is too large — please use a smaller photo.");
        }

        user.setPendingAvatarImage(dataUri);
        user.setPendingAvatarSubmittedAt(LocalDateTime.now());
        userRepository.save(user);

        return new UploadAvatarResponse(true,
            "Submitted! Your photo will appear once an admin reviews it.");
    }

    public record ChangeBioRequest(String bio) {}
    public record ChangeBioResponse(boolean success, String message) {}

    @PostMapping("/change-bio")
    public ChangeBioResponse changeBio(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                        @RequestBody ChangeBioRequest req) {
        User user = userFromToken(authHeader);
        if (user == null) {
            return new ChangeBioResponse(false, "Not logged in.");
        }
        String bio = req.bio() == null ? "" : req.bio().trim();
        if (bio.length() > MAX_BIO_LENGTH) {
            return new ChangeBioResponse(false, "Bio must be " + MAX_BIO_LENGTH + " characters or fewer.");
        }
        var moderation = moderationService.checkText(bio);
        if (!moderation.allowed()) {
            return new ChangeBioResponse(false, moderation.reason());
        }
        user.setBio(bio);
        userRepository.save(user);
        return new ChangeBioResponse(true, "Bio updated.");
    }
}
