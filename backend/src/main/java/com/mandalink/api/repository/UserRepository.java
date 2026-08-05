package com.mandalink.api.repository;

import com.mandalink.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByUsernameAndEmail(String username, String email);
    Optional<User> findByEmail(String email);
    Optional<User> findByResetToken(String resetToken);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    List<User> findAllByOrderByXpDesc();
}
