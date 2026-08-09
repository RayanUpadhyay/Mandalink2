package com.mandalink.api.repository;

import com.mandalink.api.model.CorrectRadical;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CorrectRadicalRepository extends JpaRepository<CorrectRadical, Long> {
    boolean existsByUserIdAndRadicalId(Long userId, Long radicalId);
    long countByUserId(Long userId);
}
