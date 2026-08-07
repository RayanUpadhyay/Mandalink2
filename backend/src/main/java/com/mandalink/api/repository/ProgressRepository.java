package com.mandalink.api.repository;

import com.mandalink.api.model.Progress;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ProgressRepository extends JpaRepository<Progress, Long> {
    Optional<Progress> findByUserIdAndRadicalId(Long userId, Long radicalId);
    List<Progress> findByUserId(Long userId);
    List<Progress> findByUserIdAndNextReviewAtLessThanEqual(Long userId, LocalDateTime now);
    long countByUserIdAndBoxGreaterThanEqual(Long userId, Integer box);
}
