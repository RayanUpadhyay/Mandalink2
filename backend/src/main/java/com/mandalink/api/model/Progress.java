package com.mandalink.api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "progress", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "radical_id"}))
public class Progress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "radical_id", nullable = false)
    private Long radicalId;

    // Leitner box, 1 through 6. Box 6 is considered "mastered".
    @Column(nullable = false)
    private Integer box = 1;

    @Column(name = "next_review_at", nullable = false)
    private LocalDateTime nextReviewAt = LocalDateTime.now();

    @Column(name = "last_reviewed_at")
    private LocalDateTime lastReviewedAt;

    @Column(name = "times_correct", nullable = false)
    private Integer timesCorrect = 0;

    @Column(name = "times_wrong", nullable = false)
    private Integer timesWrong = 0;

    public Progress() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getRadicalId() { return radicalId; }
    public void setRadicalId(Long radicalId) { this.radicalId = radicalId; }

    public Integer getBox() { return box; }
    public void setBox(Integer box) { this.box = box; }

    public LocalDateTime getNextReviewAt() { return nextReviewAt; }
    public void setNextReviewAt(LocalDateTime nextReviewAt) { this.nextReviewAt = nextReviewAt; }

    public LocalDateTime getLastReviewedAt() { return lastReviewedAt; }
    public void setLastReviewedAt(LocalDateTime lastReviewedAt) { this.lastReviewedAt = lastReviewedAt; }

    public Integer getTimesCorrect() { return timesCorrect; }
    public void setTimesCorrect(Integer timesCorrect) { this.timesCorrect = timesCorrect; }

    public Integer getTimesWrong() { return timesWrong; }
    public void setTimesWrong(Integer timesWrong) { this.timesWrong = timesWrong; }
}
