package com.webcrafters.confease_backend.repository;

import com.webcrafters.confease_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // This allows the Controller to look up users by their email string
    Optional<User> findByEmail(String email);
}