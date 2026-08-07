package com.mandalink.api.repository;

import com.mandalink.api.model.BadgeClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BadgeClaimRepository extends JpaRepository<BadgeClaim, Long> {
    boolean existsByUserIdAndDropId(Long userId, Long dropId);
    List<BadgeClaim> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}
