package com.mandalink.api.controller;

import com.mandalink.api.dto.AuthDtos.UserSummary;
import com.mandalink.api.dto.AuthDtos.XpUpdateRequest;
import com.mandalink.api.model.User;
import com.mandalink.api.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class LeaderboardController {

    private final UserRepository userRepository;

    public LeaderboardController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/leaderboard")
    public List<UserSummary> leaderboard() {
        return userRepository.findAllByOrderByXpDesc().stream()
            .map(u -> new UserSummary(u.getId(), u.getUsername(), u.getXp(), u.getLevel(), u.getIsAdmin()))
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
        return new UserSummary(user.getId(), user.getUsername(), user.getXp(), user.getLevel(), user.getIsAdmin());
    }
}
