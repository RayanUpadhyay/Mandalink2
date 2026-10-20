package com.mandalink.api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

// One post on the announcement board. The image (if any) lives in its own
// table (AnnouncementImage) so listing announcements never loads image bytes.
@Entity
@Table(name = "announcements")
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 160)
    private String title;

    // Short write-up, plain text (rendered as text on both sites, never as HTML).
    @Column(columnDefinition = "TEXT")
    private String body = "";

    // One of: mandalink, rayanupadhyay, other
    @Column(nullable = false, length = 32)
    private String category = "mandalink";

    @Column(nullable = false)
    private Boolean pinned = false;

    @Column(name = "has_image", nullable = false)
    private Boolean hasImage = false;

    @Column(name = "author_username")
    private String authorUsername;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Announcement() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Boolean getPinned() { return pinned; }
    public void setPinned(Boolean pinned) { this.pinned = pinned; }

    public Boolean getHasImage() { return hasImage; }
    public void setHasImage(Boolean hasImage) { this.hasImage = hasImage; }

    public String getAuthorUsername() { return authorUsername; }
    public void setAuthorUsername(String authorUsername) { this.authorUsername = authorUsername; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
