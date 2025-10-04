package org.example.jwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.example.jwt.entity.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
