package com.mandalink.api.controller;

import com.mandalink.api.dto.AuthDtos.ClaimedBadge;
import com.mandalink.api.dto.AuthDtos.UserSummary;
import com.mandalink.api.dto.AuthDtos.XpUpdateRequest;
import com.mandalink.api.model.BadgeClaim;
import com.mandalink.api.model.BadgeDrop;
import com.mandalink.api.model.User;
import com.mandalink.api.repository.BadgeClaimRepository;
import com.mandalink.api.repository.BadgeDropRepository;
import com.mandalink.api.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class LeaderboardController {

    private final UserRepository userRepository;
    private final BadgeClaimRepository badgeClaimRepository;
    private final BadgeDropRepository badgeDropRepository;

    public LeaderboardController(UserRepository userRepository, BadgeClaimRepository badgeClaimRepository,
                                  BadgeDropRepository badgeDropRepository) {
        this.userRepository = userRepository;
        this.badgeClaimRepository = badgeClaimRepository;
        this.badgeDropRepository = badgeDropRepository;
    }

    private Map<Long, BadgeDrop> allDropsById() {
        Map<Long, BadgeDrop> map = new HashMap<>();
        for (BadgeDrop d : badgeDropRepository.findAll()) {
            map.put(d.getId(), d);
        }
        return map;
    }

    private List<ClaimedBadge> claimedBadgesFor(Long userId, Map<Long, BadgeDrop> dropsById) {
        List<BadgeClaim> claims = badgeClaimRepository.findByUserId(userId);
        return claims.stream()
            .map(c -> dropsById.get(c.getDropId()))
            .filter(d -> d != null)
            .map(d -> new ClaimedBadge(d.getIcon(), d.getName(), d.getDescription()))
            .toList();
    }

    @GetMapping("/leaderboard")
    public List<UserSummary> leaderboard() {
        Map<Long, BadgeDrop> dropsById = allDropsById();
        return userRepository.findAllByOrderByXpDesc().stream()
            .map(u -> new UserSummary(u.getId(), u.getUsername(), u.getXp(), u.getLevel(), u.getIsAdmin(),
                claimedBadgesFor(u.getId(), dropsById)))
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
            claimedBadgesFor(user.getId(), allDropsById()));
    }
}
