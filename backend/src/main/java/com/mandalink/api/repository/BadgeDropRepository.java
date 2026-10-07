package com.mandalink.api.repository;

import com.mandalink.api.model.BadgeDrop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BadgeDropRepository extends JpaRepository<BadgeDrop, Long> {
    List<BadgeDrop> findByExpiresAtAfterOrderByCreatedAtDesc(LocalDateTime now);

    Optional<BadgeDrop> findFirstByRedeemCodeIgnoreCase(String redeemCode);

    // Quest badges (with a redeem code) are excluded so they never block or
    // replace the normal one-at-a-time limited drop.
    default Optional<BadgeDrop> findActive(LocalDateTime now) {
        return findByExpiresAtAfterOrderByCreatedAtDesc(now).stream()
            .filter(d -> d.getRedeemCode() == null)
            .findFirst();
    }
}
