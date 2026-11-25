package com.mandalink.api.controller;

import com.mandalink.api.model.BadgeClaim;
import com.mandalink.api.model.BadgeDrop;
import com.mandalink.api.model.User;
import com.mandalink.api.repository.BadgeClaimRepository;
import com.mandalink.api.repository.BadgeDropRepository;
import com.mandalink.api.repository.UserRepository;
import com.mandalink.api.service.JwtService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/api/badge-drops")
public class BadgeDropController {

    private final BadgeDropRepository badgeDropRepository;
    private final BadgeClaimRepository badgeClaimRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public BadgeDropController(BadgeDropRepository badgeDropRepository, BadgeClaimRepository badgeClaimRepository,
                                UserRepository userRepository, JwtService jwtService) {
        this.badgeDropRepository = badgeDropRepository;
        this.badgeClaimRepository = badgeClaimRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public record PermanentDrop(Long dropId, String name, String icon, String description, Boolean alreadyClaimed) {}

    // hasActiveDrop and the fields after it describe the current 24-hour drop; `permanent` lists the
    // always-available badges (see BadgeDropRepository.isPermanent), which show alongside it.
    public record ActiveDropResponse(boolean hasActiveDrop, Long dropId, String name, String icon,
                                      String description, Long secondsRemaining, Boolean alreadyClaimed,
                                      List<PermanentDrop> permanent) {}

    private User userFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        String token = authHeader.substring(7);
        if (!jwtService.isValid(token)) return null;
        return userRepository.findByUsername(jwtService.extractUsername(token)).orElse(null);
    }

    @GetMapping("/active")
    public ActiveDropResponse active(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        LocalDateTime now = LocalDateTime.now();
        User user = userFromToken(authHeader);
        List<PermanentDrop> permanent = badgeDropRepository.findPermanent(now).stream()
            .map(d -> new PermanentDrop(d.getId(), d.getName(), d.getIcon(), d.getDescription(),
                user == null ? null : badgeClaimRepository.existsByUserIdAndDropId(user.getId(), d.getId())))
            .toList();

        var dropOpt = badgeDropRepository.findActive(now);
        if (dropOpt.isEmpty()) {
            return new ActiveDropResponse(false, null, null, null, null, null, null, permanent);
        }
        BadgeDrop drop = dropOpt.get();
        long secondsRemaining = ChronoUnit.SECONDS.between(now, drop.getExpiresAt());

        Boolean claimed = null;
        if (user != null) {
            claimed = badgeClaimRepository.existsByUserIdAndDropId(user.getId(), drop.getId());
        }

        return new ActiveDropResponse(true, drop.getId(), drop.getName(), drop.getIcon(),
            drop.getDescription(), Math.max(0, secondsRemaining), claimed, permanent);
    }

    public record ClaimRequest(Long dropId) {}
    public record ClaimResponse(boolean success, String message) {}

    @PostMapping("/claim")
    public ClaimResponse claim(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                @RequestBody ClaimRequest req) {
        User user = userFromToken(authHeader);
        if (user == null) {
            return new ClaimResponse(false, "You need to be logged in to claim this.");
        }

        var dropOpt = badgeDropRepository.findById(req.dropId());
        if (dropOpt.isEmpty()) {
            return new ClaimResponse(false, "This badge drop doesn't exist.");
        }
        BadgeDrop drop = dropOpt.get();
        if (drop.getExpiresAt().isBefore(LocalDateTime.now())) {
            return new ClaimResponse(false, "This drop has expired.");
        }
        if (badgeClaimRepository.existsByUserIdAndDropId(user.getId(), drop.getId())) {
            return new ClaimResponse(false, "You've already claimed this badge.");
        }

        BadgeClaim claim = new BadgeClaim();
        claim.setUserId(user.getId());
        claim.setDropId(drop.getId());
        badgeClaimRepository.save(claim);

        return new ClaimResponse(true, "Claimed " + drop.getIcon() + " " + drop.getName() + "!");
    }
}
