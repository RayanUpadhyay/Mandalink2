package com.mandalink.api.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "user_stats")
public class UserStats {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "current_streak", nullable = false)
    private Integer currentStreak = 0;

    @Column(name = "last_active_date")
    private LocalDate lastActiveDate;

    @Column(name = "perfect_quiz_count", nullable = false)
    private Integer perfectQuizCount = 0;

    @Column(name = "timed_high_score_count", nullable = false)
    private Integer timedHighScoreCount = 0;

    @Column(name = "flashcards_completed_count", nullable = false)
    private Integer flashcardsCompletedCount = 0;

    @Column(name = "no_hint_streak", nullable = false)
    private Integer noHintStreak = 0;

    @Column(name = "comeback_count", nullable = false)
    private Integer comebackCount = 0;

    @Column(name = "reached_number_one", nullable = false)
    private Boolean reachedNumberOne = false;

    public UserStats() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Integer getCurrentStreak() { return currentStreak; }
    public void setCurrentStreak(Integer currentStreak) { this.currentStreak = currentStreak; }

    public LocalDate getLastActiveDate() { return lastActiveDate; }
    public void setLastActiveDate(LocalDate lastActiveDate) { this.lastActiveDate = lastActiveDate; }

    public Integer getPerfectQuizCount() { return perfectQuizCount; }
    public void setPerfectQuizCount(Integer perfectQuizCount) { this.perfectQuizCount = perfectQuizCount; }

    public Integer getTimedHighScoreCount() { return timedHighScoreCount; }
    public void setTimedHighScoreCount(Integer timedHighScoreCount) { this.timedHighScoreCount = timedHighScoreCount; }

    public Integer getFlashcardsCompletedCount() { return flashcardsCompletedCount; }
    public void setFlashcardsCompletedCount(Integer flashcardsCompletedCount) { this.flashcardsCompletedCount = flashcardsCompletedCount; }

    public Integer getNoHintStreak() { return noHintStreak; }
    public void setNoHintStreak(Integer noHintStreak) { this.noHintStreak = noHintStreak; }

    public Integer getComebackCount() { return comebackCount; }
    public void setComebackCount(Integer comebackCount) { this.comebackCount = comebackCount; }

    public Boolean getReachedNumberOne() { return reachedNumberOne; }
    public void setReachedNumberOne(Boolean reachedNumberOne) { this.reachedNumberOne = reachedNumberOne; }
}
