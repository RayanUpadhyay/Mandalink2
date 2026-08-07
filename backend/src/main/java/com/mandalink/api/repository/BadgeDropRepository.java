package com.mandalink.api.repository;

import com.mandalink.api.model.BadgeDrop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BadgeDropRepository extends JpaRepository<BadgeDrop, Long> {
    List<BadgeDrop> findByExpiresAtAfterOrderByCreatedAtDesc(LocalDateTime now);

    default Optional<BadgeDrop> findActive(LocalDateTime now) {
        List<BadgeDrop> active = findByExpiresAtAfterOrderByCreatedAtDesc(now);
        return active.isEmpty() ? Optional.empty() : Optional.of(active.get(0));
    }
}
