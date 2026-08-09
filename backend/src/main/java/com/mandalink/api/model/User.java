package com.mandalink.api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private Integer xp = 0;

    @Column(nullable = false)
    private Integer level = 1;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "reset_token")
    private String resetToken;

    @Column(name = "reset_token_expiry")
    private LocalDateTime resetTokenExpiry;

    @Column(name = "auth_provider")
    private String authProvider = "local";

    @Column(name = "is_admin")
    private Boolean isAdmin = false;

    @Column
    private String avatar = "panda";

    // Approved custom photo, stored as a full data URI. Null means "use the
    // preset emoji avatar above instead."
    @Column(columnDefinition = "TEXT")
    private String avatarImage;

    // Newly uploaded photo awaiting admin review. Kept separate from
    // avatarImage so the old approved photo (if any) keeps showing while a
    // resubmission is pending, instead of going blank.
    @Column(columnDefinition = "TEXT")
    private String pendingAvatarImage;

    @Column(name = "pending_avatar_submitted_at")
    private LocalDateTime pendingAvatarSubmittedAt;

    @Column(columnDefinition = "TEXT")
    private String bio = "";

    @Column(name = "featured_badge_key")
    private String featuredBadgeKey;

    public User() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public Integer getXp() { return xp; }
    public void setXp(Integer xp) { this.xp = xp; }

    public Integer getLevel() { return level; }
    public void setLevel(Integer level) { this.level = level; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getResetToken() { return resetToken; }
    public void setResetToken(String resetToken) { this.resetToken = resetToken; }

    public LocalDateTime getResetTokenExpiry() { return resetTokenExpiry; }
    public void setResetTokenExpiry(LocalDateTime resetTokenExpiry) { this.resetTokenExpiry = resetTokenExpiry; }

    public String getAuthProvider() { return authProvider; }
    public void setAuthProvider(String authProvider) { this.authProvider = authProvider; }

    public Boolean getIsAdmin() { return isAdmin; }
    public void setIsAdmin(Boolean isAdmin) { this.isAdmin = isAdmin; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getAvatarImage() { return avatarImage; }
    public void setAvatarImage(String avatarImage) { this.avatarImage = avatarImage; }

    public String getPendingAvatarImage() { return pendingAvatarImage; }
    public void setPendingAvatarImage(String pendingAvatarImage) { this.pendingAvatarImage = pendingAvatarImage; }

    public LocalDateTime getPendingAvatarSubmittedAt() { return pendingAvatarSubmittedAt; }
    public void setPendingAvatarSubmittedAt(LocalDateTime pendingAvatarSubmittedAt) { this.pendingAvatarSubmittedAt = pendingAvatarSubmittedAt; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getFeaturedBadgeKey() { return featuredBadgeKey; }
    public void setFeaturedBadgeKey(String featuredBadgeKey) { this.featuredBadgeKey = featuredBadgeKey; }
}
