package com.mandalink.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "correct_radicals", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "radical_id"}))
public class CorrectRadical {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "radical_id", nullable = false)
    private Long radicalId;

    public CorrectRadical() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getRadicalId() { return radicalId; }
    public void setRadicalId(Long radicalId) { this.radicalId = radicalId; }
}
