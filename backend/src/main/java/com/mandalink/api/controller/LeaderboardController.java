package com.mandalink.api.controller;

import com.mandalink.api.dto.AuthDtos.UserSummary;
import com.mandalink.api.dto.AuthDtos.XpUpdateRequest;
import com.mandalink.api.model.User;
import com.mandalink.api.repository.UserRepository;
import com.mandalink.api.service.BadgeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class LeaderboardController {

    private final UserRepository userRepository;
    private final BadgeService badgeService;

    public LeaderboardController(UserRepository userRepository, BadgeService badgeService) {
        this.userRepository = userRepository;
        this.badgeService = badgeService;
    }

    @GetMapping("/leaderboard")
    public List<UserSummary> leaderboard() {
        var dropsById = badgeService.allDropsById();
        return userRepository.findAllByOrderByXpDesc().stream()
            .map(u -> new UserSummary(u.getId(), u.getUsername(), u.getXp(), u.getLevel(), u.getIsAdmin(),
                badgeService.badgesFor(u, dropsById), u.getAvatar(), u.getAvatarImage()))
            .toList();
    }

    @PostMapping("/users/{username}/xp")
    public UserSummary addXp(@PathVariable String username, @RequestBody XpUpdateRequest req) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        int newXp = user.getXp() + req.amount();
        int newLevel = (newXp / 100) + 1;
        user.setXp(newXp);
        user.setLevel(newLevel);
        userRepository.save(user);
        return new UserSummary(user.getId(), user.getUsername(), user.getXp(), user.getLevel(), user.getIsAdmin(),
            badgeService.badgesFor(user), user.getAvatar(), user.getAvatarImage());
    }
}
