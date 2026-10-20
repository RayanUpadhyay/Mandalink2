package com.mandalink.api.model;

import jakarta.persistence.*;

// The image bytes for an announcement, stored in the database (same Postgres
// as everything else — no extra storage service needed). At most one per post.
@Entity
@Table(name = "announcement_images")
public class AnnouncementImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "announcement_id", nullable = false, unique = true)
    private Long announcementId;

    @Column(name = "content_type", nullable = false, length = 64)
    private String contentType;

    // byte[] maps to bytea on PostgreSQL. The length only matters for H2 (local dev).
    @Column(name = "data", nullable = false, length = 3000000)
    private byte[] data;

    public AnnouncementImage() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAnnouncementId() { return announcementId; }
    public void setAnnouncementId(Long announcementId) { this.announcementId = announcementId; }

    public String getContentType() { return contentType; }
    public void setContentType(String contentType) { this.contentType = contentType; }

    public byte[] getData() { return data; }
    public void setData(byte[] data) { this.data = data; }
}
