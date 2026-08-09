package com.mandalink.api.repository;

import com.mandalink.api.model.WrongRadical;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface WrongRadicalRepository extends JpaRepository<WrongRadical, Long> {
    Optional<WrongRadical> findByUserIdAndRadicalId(Long userId, Long radicalId);
}
