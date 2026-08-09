package com.mandalink.api.service;

import com.mandalink.api.dto.AuthDtos.ClaimedBadge;
import com.mandalink.api.model.BadgeClaim;
import com.mandalink.api.model.BadgeDrop;
import com.mandalink.api.model.User;
import com.mandalink.api.repository.BadgeClaimRepository;
import com.mandalink.api.repository.BadgeDropRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BadgeService {

    private final BadgeClaimRepository badgeClaimRepository;
    private final BadgeDropRepository badgeDropRepository;

    private static final ClaimedBadge STAFF_BADGE =
        new ClaimedBadge("🛠️", "Staff", "Behind the scenes, keeping Mandalink running");

    public BadgeService(BadgeClaimRepository badgeClaimRepository, BadgeDropRepository badgeDropRepository) {
        this.badgeClaimRepository = badgeClaimRepository;
        this.badgeDropRepository = badgeDropRepository;
    }

    public Map<Long, BadgeDrop> allDropsById() {
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

    // The Staff badge isn't claimed — it's tied directly to isAdmin, so it
    // appears the instant someone is made admin and disappears the instant
    // that's revoked. No manual action needed on either end.
    public List<ClaimedBadge> badgesFor(User user, Map<Long, BadgeDrop> dropsById) {
        List<ClaimedBadge> badges = new ArrayList<>();
        if (Boolean.TRUE.equals(user.getIsAdmin())) {
            badges.add(STAFF_BADGE);
        }
        badges.addAll(claimedBadgesFor(user.getId(), dropsById));
        return badges;
    }

    public List<ClaimedBadge> badgesFor(User user) {
        return badgesFor(user, allDropsById());
    }
}
