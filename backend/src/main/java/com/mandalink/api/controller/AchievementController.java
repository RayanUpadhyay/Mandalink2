package com.mandalink.api.controller;

import com.mandalink.api.dto.AuthDtos.ClaimedBadge;
import com.mandalink.api.model.User;
import com.mandalink.api.repository.UserRepository;
import com.mandalink.api.service.AchievementService;
import com.mandalink.api.service.AchievementService.AchievementView;
import com.mandalink.api.service.AchievementService.CatalogEntry;
import com.mandalink.api.service.JwtService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    private final UserRepository userRepository;
    private final AchievementService achievementService;
    private final JwtService jwtService;

    public AchievementController(UserRepository userRepository, AchievementService achievementService, JwtService jwtService) {
        this.userRepository = userRepository;
        this.achievementService = achievementService;
        this.jwtService = jwtService;
    }

    private User userFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        String token = authHeader.substring(7);
        if (!jwtService.isValid(token)) return null;
        return userRepository.findByUsername(jwtService.extractUsername(token)).orElse(null);
    }

    public record MyAchievementsResponse(boolean success, String message, List<AchievementView> achievements,
                                          List<ClaimedBadge> selectableBadges, ClaimedBadge featuredBadge) {}

    @GetMapping("/me")
    public MyAchievementsResponse me(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        User user = userFromToken(authHeader);
        if (user == null) {
            return new MyAchievementsResponse(false, "Not logged in.", null, null, null);
        }
        return new MyAchievementsResponse(true, "OK",
            achievementService.collectionFor(user),
            achievementService.allSelectableBadgesFor(user),
            achievementService.resolveFeaturedBadge(user));
    }

    public record PublicFeaturedResponse(boolean success, ClaimedBadge featuredBadge) {}

    @GetMapping("/user/{username}")
    public PublicFeaturedResponse publicFeatured(@PathVariable String username) {
        var userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return new PublicFeaturedResponse(false, null);
        }
        return new PublicFeaturedResponse(true, achievementService.resolveFeaturedBadge(userOpt.get()));
    }

    public record FeatureRequest(String badgeKey) {}
    public record FeatureResponse(boolean success, String message, ClaimedBadge featuredBadge) {}

    @PostMapping("/feature")
    public FeatureResponse feature(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                    @RequestBody FeatureRequest req) {
        User user = userFromToken(authHeader);
        if (user == null) {
            return new FeatureResponse(false, "Not logged in.", null);
        }
        if (req.badgeKey() == null || req.badgeKey().isBlank()) {
            return new FeatureResponse(false, "No badge specified.", null);
        }
        boolean owns = achievementService.allSelectableBadgesFor(user).stream()
            .anyMatch(b -> b.key().equals(req.badgeKey()));
        if (!owns) {
            return new FeatureResponse(false, "You haven't unlocked that badge.", null);
        }
        user.setFeaturedBadgeKey(req.badgeKey());
        userRepository.save(user);
        return new FeatureResponse(true, "Featured badge updated.", achievementService.resolveFeaturedBadge(user));
    }

    public record RecordResponse(boolean success, List<CatalogEntry> newlyUnlocked) {}

    public record RecordAnswerRequest(Long radicalId, boolean correct) {}

    @PostMapping("/record-answer")
    public RecordResponse recordAnswer(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                        @RequestBody RecordAnswerRequest req) {
        User user = userFromToken(authHeader);
        if (user == null) return new RecordResponse(false, List.of());
        return new RecordResponse(true, achievementService.recordAnswer(user, req.radicalId(), req.correct()));
    }

    public record RecordSessionRequest(Integer correct, Integer total) {}

    @PostMapping("/record-quiz-complete")
    public RecordResponse recordQuizComplete(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                              @RequestBody RecordSessionRequest req) {
        User user = userFromToken(authHeader);
        if (user == null) return new RecordResponse(false, List.of());
        int correct = req.correct() == null ? 0 : req.correct();
        int total = req.total() == null ? 0 : req.total();
        return new RecordResponse(true, achievementService.recordQuizComplete(user, correct, total));
    }

    @PostMapping("/record-timed-complete")
    public RecordResponse recordTimedComplete(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                               @RequestBody RecordSessionRequest req) {
        User user = userFromToken(authHeader);
        if (user == null) return new RecordResponse(false, List.of());
        int correct = req.correct() == null ? 0 : req.correct();
        int total = req.total() == null ? 0 : req.total();
        return new RecordResponse(true, achievementService.recordTimedComplete(user, correct, total));
    }

    @PostMapping("/record-flashcard-view")
    public RecordResponse recordFlashcardView(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        User user = userFromToken(authHeader);
        if (user == null) return new RecordResponse(false, List.of());
        return new RecordResponse(true, achievementService.recordFlashcardView(user));
    }
}
