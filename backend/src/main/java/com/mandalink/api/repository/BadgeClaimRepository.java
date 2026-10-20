package com.mandalink.api.repository;

import com.mandalink.api.model.BadgeClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface BadgeClaimRepository extends JpaRepository<BadgeClaim, Long> {
    boolean existsByUserIdAndDropId(Long userId, Long dropId);
    List<BadgeClaim> findByUserId(Long userId);
    // Derived delete queries need an active transaction, otherwise Spring throws
    // TransactionRequiredException as soon as there is a row to remove.
    @Transactional
    void deleteByUserId(Long userId);
}
