package com.carehome.model;

import java.time.LocalDateTime;

public class Admin {
    private Long adminId;
    private String username;
    private String passwordHash;
    private String email;
    private String fullName;
    private String phone;
    private LocalDateTime createdAt;
    private boolean active;

    public Admin() {}

    public Admin(Long adminId, String username, String passwordHash, String email,
                 String fullName, LocalDateTime createdAt, boolean active) {
        this.adminId = adminId;
        this.username = username;
        this.passwordHash = passwordHash;
        this.email = email;
        this.fullName = fullName;
        this.createdAt = createdAt;
        this.active = active;
    }

    public Long getAdminId() { return adminId; }
    public void setAdminId(Long adminId) { this.adminId = adminId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
