package com.mandalink.api.repository;

import com.mandalink.api.model.BadgeDrop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BadgeDropRepository extends JpaRepository<BadgeDrop, Long> {
    List<BadgeDrop> findByExpiresAtAfterOrderByCreatedAtDesc(LocalDateTime now);

    // A drop with more than a year left counts as permanent (always claimable, like the Great Sage badge).
    // Permanent drops sit alongside the normal 24-hour drops: they never block a new drop, and "end drop"
    // only ends the timed one. To make a drop permanent, push its expires_at more than a year out.
    long PERMANENT_AFTER_DAYS = 365;

    static boolean isPermanent(BadgeDrop d, LocalDateTime now) {
        return d.getExpiresAt().isAfter(now.plusDays(PERMANENT_AFTER_DAYS));
    }

    /** The current timed (24-hour) drop, if there is one. Permanent drops are left out. */
    default Optional<BadgeDrop> findActive(LocalDateTime now) {
        return findByExpiresAtAfterOrderByCreatedAtDesc(now).stream()
            .filter(d -> !isPermanent(d, now))
            .findFirst();
    }

    /** Every permanent drop, newest first. */
    default List<BadgeDrop> findPermanent(LocalDateTime now) {
        return findByExpiresAtAfterOrderByCreatedAtDesc(now).stream()
            .filter(d -> isPermanent(d, now))
            .toList();
    }
}
