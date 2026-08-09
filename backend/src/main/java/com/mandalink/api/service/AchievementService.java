package com.mandalink.api.service;

import com.mandalink.api.dto.AuthDtos.ClaimedBadge;
import com.mandalink.api.model.*;
import com.mandalink.api.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AchievementService {

    private final UserStatsRepository userStatsRepository;
    private final CorrectRadicalRepository correctRadicalRepository;
    private final WrongRadicalRepository wrongRadicalRepository;
    private final AchievementUnlockRepository achievementUnlockRepository;
    private final BadgeService badgeService;

    public AchievementService(UserStatsRepository userStatsRepository, CorrectRadicalRepository correctRadicalRepository,
                               WrongRadicalRepository wrongRadicalRepository, AchievementUnlockRepository achievementUnlockRepository,
                               BadgeService badgeService) {
        this.userStatsRepository = userStatsRepository;
        this.correctRadicalRepository = correctRadicalRepository;
        this.wrongRadicalRepository = wrongRadicalRepository;
        this.achievementUnlockRepository = achievementUnlockRepository;
        this.badgeService = badgeService;
    }

    // ---- The 8-badge catalog ----
    public record CatalogEntry(String key, String icon, String name, String description, int target) {}

    public static final List<CatalogEntry> CATALOG = List.of(
        new CatalogEntry("on_fire", "🔥", "On Fire", "Maintain a 7-day learning streak.", 7),
        new CatalogEntry("perfectionist", "💯", "Perfectionist", "Get 100% on 10 quizzes.", 10),
        new CatalogEntry("radical_detective", "🧠", "Radical Detective", "Correctly identify 50 radicals.", 50),
        new CatalogEntry("speed_demon", "⚡", "Speed Demon", "Score 90% or higher in 10 timed challenges.", 10),
        new CatalogEntry("card_master", "🃏", "Card Master", "Complete 250 flashcards.", 250),
        new CatalogEntry("no_hints", "🥷", "No Hints Needed", "Get 25 consecutive questions correct without using hints.", 25),
        new CatalogEntry("comeback_kid", "📈", "Comeback Kid", "Correctly answer 25 questions you'd previously gotten wrong.", 25),
        new CatalogEntry("leaderboard_legend", "👑", "Leaderboard Legend", "Reach #1 on the leaderboard at least once.", 1)
    );

    // XP-tier badges — mirrors frontend/src/utils/badges.js exactly. Duplicated
    // here (not shared) because that file is frontend-only; this lets the
    // backend resolve a user's current tier for leaderboard/featured-badge use.
    private record XpTier(int xp, String key, String icon, String name) {}
    private static final List<XpTier> XP_TIERS = List.of(
        new XpTier(2500, "xp:legend", "👑", "Radical Legend"),
        new XpTier(1000, "xp:diamond", "💎", "Diamond Sage"),
        new XpTier(500, "xp:gold", "🥇", "Gold Master"),
        new XpTier(200, "xp:silver", "🥈", "Silver Scholar"),
        new XpTier(50, "xp:bronze", "🥉", "Bronze Learner")
    );

    private Optional<XpTier> currentXpTier(int xp) {
        return XP_TIERS.stream().filter(t -> xp >= t.xp()).findFirst();
    }

    public UserStats statsFor(User user) {
        return userStatsRepository.findByUserId(user.getId()).orElseGet(() -> {
            UserStats s = new UserStats();
            s.setUserId(user.getId());
            return userStatsRepository.save(s);
        });
    }

    private void bumpStreak(UserStats stats) {
        LocalDate today = LocalDate.now();
        LocalDate last = stats.getLastActiveDate();
        if (last == null) {
            stats.setCurrentStreak(1);
        } else if (last.equals(today)) {
            // already counted today, no change
        } else if (last.equals(today.minusDays(1))) {
            stats.setCurrentStreak(stats.getCurrentStreak() + 1);
        } else {
            stats.setCurrentStreak(1);
        }
        stats.setLastActiveDate(today);
    }

    // Progress for a given catalog entry, capped at target for display.
    private int progressFor(CatalogEntry entry, User user, UserStats stats) {
        return switch (entry.key()) {
            case "on_fire" -> Math.min(stats.getCurrentStreak(), entry.target());
            case "perfectionist" -> Math.min(stats.getPerfectQuizCount(), entry.target());
            case "radical_detective" -> (int) Math.min(correctRadicalRepository.countByUserId(user.getId()), entry.target());
            case "speed_demon" -> Math.min(stats.getTimedHighScoreCount(), entry.target());
            case "card_master" -> Math.min(stats.getFlashcardsCompletedCount(), entry.target());
            case "no_hints" -> Math.min(stats.getNoHintStreak(), entry.target());
            case "comeback_kid" -> Math.min(stats.getComebackCount(), entry.target());
            case "leaderboard_legend" -> Boolean.TRUE.equals(stats.getReachedNumberOne()) ? entry.target() : 0;
            default -> 0;
        };
    }

    private boolean meetsRequirement(CatalogEntry entry, User user, UserStats stats) {
        return progressFor(entry, user, stats) >= entry.target();
    }

    // Checks every catalog entry; unlocks (idempotently) any newly-met ones.
    // Returns the list of badges that were newly unlocked THIS call, for toasts.
    public List<CatalogEntry> checkUnlocks(User user) {
        UserStats stats = statsFor(user);
        List<CatalogEntry> newlyUnlocked = new ArrayList<>();
        for (CatalogEntry entry : CATALOG) {
            if (achievementUnlockRepository.existsByUserIdAndBadgeKey(user.getId(), entry.key())) continue;
            if (meetsRequirement(entry, user, stats)) {
                AchievementUnlock unlock = new AchievementUnlock();
                unlock.setUserId(user.getId());
                unlock.setBadgeKey(entry.key());
                achievementUnlockRepository.save(unlock);
                newlyUnlocked.add(entry);
            }
        }
        return newlyUnlocked;
    }

    // ---- Activity recording ----

    public List<CatalogEntry> recordAnswer(User user, Long radicalId, boolean correct) {
        UserStats stats = statsFor(user);
        bumpStreak(stats);

        if (correct) {
            stats.setNoHintStreak(stats.getNoHintStreak() + 1);
            if (radicalId != null && !correctRadicalRepository.existsByUserIdAndRadicalId(user.getId(), radicalId)) {
                CorrectRadical cr = new CorrectRadical();
                cr.setUserId(user.getId());
                cr.setRadicalId(radicalId);
                correctRadicalRepository.save(cr);
            }
            if (radicalId != null) {
                wrongRadicalRepository.findByUserIdAndRadicalId(user.getId(), radicalId).ifPresent(wr -> {
                    wrongRadicalRepository.delete(wr);
                    stats.setComebackCount(stats.getComebackCount() + 1);
                });
            }
        } else {
            stats.setNoHintStreak(0);
            if (radicalId != null && wrongRadicalRepository.findByUserIdAndRadicalId(user.getId(), radicalId).isEmpty()) {
                WrongRadical wr = new WrongRadical();
                wr.setUserId(user.getId());
                wr.setRadicalId(radicalId);
                wrongRadicalRepository.save(wr);
            }
        }

        userStatsRepository.save(stats);
        return checkUnlocks(user);
    }

    public List<CatalogEntry> recordQuizComplete(User user, int correct, int total) {
        UserStats stats = statsFor(user);
        bumpStreak(stats);
        if (total > 0 && correct == total) {
            stats.setPerfectQuizCount(stats.getPerfectQuizCount() + 1);
        }
        userStatsRepository.save(stats);
        return checkUnlocks(user);
    }

    public List<CatalogEntry> recordTimedComplete(User user, int correct, int total) {
        UserStats stats = statsFor(user);
        bumpStreak(stats);
        if (total > 0 && ((double) correct / total) >= 0.9) {
            stats.setTimedHighScoreCount(stats.getTimedHighScoreCount() + 1);
        }
        userStatsRepository.save(stats);
        return checkUnlocks(user);
    }

    public List<CatalogEntry> recordFlashcardView(User user) {
        UserStats stats = statsFor(user);
        bumpStreak(stats);
        stats.setFlashcardsCompletedCount(stats.getFlashcardsCompletedCount() + 1);
        userStatsRepository.save(stats);
        return checkUnlocks(user);
    }

    // Called whenever XP changes — checks if this user just reached #1.
    public List<CatalogEntry> checkLeaderboardRank(User user, int rank) {
        if (rank != 1) return List.of();
        UserStats stats = statsFor(user);
        if (Boolean.TRUE.equals(stats.getReachedNumberOne())) return List.of();
        stats.setReachedNumberOne(true);
        userStatsRepository.save(stats);
        return checkUnlocks(user);
    }

    // ---- Views for the frontend ----

    public record AchievementView(String key, String icon, String name, String description,
                                   boolean unlocked, int current, int target) {}

    public List<AchievementView> collectionFor(User user) {
        UserStats stats = statsFor(user);
        List<AchievementView> views = new ArrayList<>();
        for (CatalogEntry entry : CATALOG) {
            boolean unlocked = achievementUnlockRepository.existsByUserIdAndBadgeKey(user.getId(), entry.key());
            int current = progressFor(entry, user, stats);
            views.add(new AchievementView(entry.key(), entry.icon(), entry.name(), entry.description(),
                unlocked, current, entry.target()));
        }
        return views;
    }

    // Every badge, across every system, that this user currently has unlocked
    // and could legally feature. Order = display priority for fallback.
    public List<ClaimedBadge> allSelectableBadgesFor(User user) {
        List<ClaimedBadge> list = new ArrayList<>();

        currentXpTier(user.getXp()).ifPresent(tier ->
            list.add(new ClaimedBadge(tier.key(), tier.icon(), tier.name(), "Reached " + tier.xp() + "+ XP")));

        list.addAll(badgeService.badgesFor(user));

        for (AchievementUnlock unlock : achievementUnlockRepository.findByUserId(user.getId())) {
            CATALOG.stream().filter(e -> e.key().equals(unlock.getBadgeKey())).findFirst()
                .ifPresent(e -> list.add(new ClaimedBadge(e.key(), e.icon(), e.name(), e.description())));
        }

        return list;
    }

    // Resolves what to actually show as the user's ONE featured badge —
    // their explicit choice if still valid, otherwise a sensible fallback,
    // otherwise null (empty state).
    public ClaimedBadge resolveFeaturedBadge(User user) {
        List<ClaimedBadge> selectable = allSelectableBadgesFor(user);
        if (selectable.isEmpty()) return null;

        String chosenKey = user.getFeaturedBadgeKey();
        if (chosenKey != null) {
            for (ClaimedBadge b : selectable) {
                if (b.key().equals(chosenKey)) return b;
            }
        }
        // Fallback: first entry, since allSelectableBadgesFor already orders
        // XP-tier first, then staff/limited-drops, then achievements.
        return selectable.get(0);
    }
}
