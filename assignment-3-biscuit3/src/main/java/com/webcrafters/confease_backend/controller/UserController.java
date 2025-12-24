package com.webcrafters.confease_backend.controller;

import com.webcrafters.confease_backend.model.User;
import com.webcrafters.confease_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*") // Allows Angular to connect
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // 1. POST /users/login — Handles Authentication
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginReq) {
        return userRepository.findByEmail(loginReq.getEmail())
                .map(user -> {
                    // Check password (Note: In production, use BCrypt.checkPassword)
                    if (user.getPassword_hash().equals(loginReq.getPassword_hash())) {
                        return ResponseEntity.ok(user);
                    }
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
                })
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found"));
    }

    // 2. POST /users — Handles Registration
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        // 1. Check if email exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already exists");
        }

        try {
            // 2. SET DEFAULTS FOR MISSING FIELDS
            // This fixes the "is_email_verified cannot be null" error
            if (user.getIs_email_verified() == null) {
                user.setIs_email_verified(false);
            }

            // Ensure category has a value if missing
            if (user.getCategory() == null || user.getCategory().isEmpty()) {
                user.setCategory("other");
            }

            User savedUser = userRepository.save(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (Exception e) {
            // Log the error for debugging
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + e.getMessage());
        }
    }

    // 3. GET /users — List all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 4. GET /users/{id} — View user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 5. PUT /users/{id} — Update user
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    existingUser.setEmail(updatedUser.getEmail());
                    existingUser.setPassword_hash(updatedUser.getPassword_hash());
                    existingUser.setFirst_name(updatedUser.getFirst_name());
                    existingUser.setLast_name(updatedUser.getLast_name());
                    existingUser.setAffiliation(updatedUser.getAffiliation());
                    existingUser.setCountry(updatedUser.getCountry());
                    existingUser.setCategory(updatedUser.getCategory());
                    existingUser.setOrcid(updatedUser.getOrcid());
                    existingUser.setProfile_picture(updatedUser.getProfile_picture());
                    existingUser.setIs_email_verified(updatedUser.getIs_email_verified());
                    existingUser.setUpdated_at(new java.sql.Timestamp(System.currentTimeMillis()));

                    userRepository.save(existingUser);
                    return ResponseEntity.ok(existingUser);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 6. DELETE /users/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    return ResponseEntity.ok("User deleted successfully.");
                })
                .orElse(ResponseEntity.notFound().build());
    }
}