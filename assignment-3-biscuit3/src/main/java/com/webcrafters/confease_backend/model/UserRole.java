package com.webcrafters.confease_backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;



import jakarta.persistence.*;
import java.sql.Timestamp;
import java.time.Instant;

@Entity
@Table(name = "user_role")
@IdClass(UserRoleId.class)
public class UserRole {

    @Id
    @Column(name = "user_id") // Maps to SQL column
    @JsonProperty("user_id") // Maps to Angular JSON
    private Long user_id;

    @Id
    @Column(name = "role_id") // Maps to SQL column
    @JsonProperty("role_id") // Maps to Angular JSON
    private Integer role_id;

    @Column(name = "assigned_at", insertable = false, updatable = false)
    private Timestamp assigned_at;

    // Constructors
    public UserRole() {}

    public UserRole(Long user_id, Integer role_id) {
        this.user_id = user_id;
        this.role_id = role_id;
        this.assigned_at = Timestamp.from(Instant.now());
    }

    // Getters and Setters
    public Long getUser_id() { return user_id; }
    public void setUser_id(Long user_id) { this.user_id = user_id; }

    public Integer getRole_id() { return role_id; }
    public void setRole_id(Integer role_id) { this.role_id = role_id; }

    public Timestamp getAssigned_at() { return assigned_at; }
    public void setAssigned_at(Timestamp assigned_at) { this.assigned_at = assigned_at; }
}