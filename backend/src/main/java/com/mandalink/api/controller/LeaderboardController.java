package com.mandalink.api.controller;

import com.mandalink.api.dto.AuthDtos.UserSummary;
import com.mandalink.api.dto.AuthDtos.XpUpdateRequest;
import com.mandalink.api.model.User;
import com.mandalink.api.repository.UserRepository;
import com.mandalink.api.service.AchievementService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class LeaderboardController {

    private final UserRepository userRepository;
    private final AchievementService achievementService;

    public LeaderboardController(UserRepository userRepository, AchievementService achievementService) {
        this.userRepository = userRepository;
        this.achievementService = achievementService;
    }

    // The leaderboard shows ONE badge per user — their chosen Featured Badge
    // (or a sensible fallback) — never their full collection. See
    // AchievementService.resolveFeaturedBadge for the selection logic.
    @GetMapping("/leaderboard")
    public List<UserSummary> leaderboard() {
        return userRepository.findAllByOrderByXpDesc().stream()
            .map(u -> new UserSummary(u.getId(), u.getUsername(), u.getXp(), u.getLevel(), u.getIsAdmin(),
                achievementService.resolveFeaturedBadge(u), u.getAvatar(), u.getAvatarImage()))
            .toList();
    }

    @PostMapping("/users/{username}/xp")
    public UserSummary addXp(@PathVariable String username, @RequestBody XpUpdateRequest req) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Existing XP/level logic — completely unchanged.
        int newXp = user.getXp() + req.amount();
        int newLevel = (newXp / 100) + 1;
        user.setXp(newXp);
        user.setLevel(newLevel);
        userRepository.save(user);

        // New, separate: check if this XP change just put them at #1, for
        // the "Leaderboard Legend" achievement. Does not affect XP/level at all.
        List<User> ranked = userRepository.findAllByOrderByXpDesc();
        for (int i = 0; i < ranked.size(); i++) {
            if (ranked.get(i).getId().equals(user.getId())) {
                achievementService.checkLeaderboardRank(user, i + 1);
                break;
            }
        }

        return new UserSummary(user.getId(), user.getUsername(), user.getXp(), user.getLevel(), user.getIsAdmin(),
            achievementService.resolveFeaturedBadge(user), user.getAvatar(), user.getAvatarImage());
    }
}
