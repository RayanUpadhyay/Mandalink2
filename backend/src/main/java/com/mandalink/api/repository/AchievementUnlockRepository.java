package com.mandalink.api.repository;

import com.mandalink.api.model.AchievementUnlock;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AchievementUnlockRepository extends JpaRepository<AchievementUnlock, Long> {
    boolean existsByUserIdAndBadgeKey(Long userId, String badgeKey);
    List<AchievementUnlock> findByUserId(Long userId);
}
