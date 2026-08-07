package com.mandalink.api.controller;

import com.mandalink.api.model.Progress;
import com.mandalink.api.model.Radical;
import com.mandalink.api.model.User;
import com.mandalink.api.repository.ProgressRepository;
import com.mandalink.api.repository.RadicalRepository;
import com.mandalink.api.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressRepository progressRepository;
    private final RadicalRepository radicalRepository;
    private final UserRepository userRepository;

    public ProgressController(ProgressRepository progressRepository, RadicalRepository radicalRepository,
                               UserRepository userRepository) {
        this.progressRepository = progressRepository;
        this.radicalRepository = radicalRepository;
        this.userRepository = userRepository;
    }

    // Box -> days until next review. Box 6 = "mastered", still resurfaces occasionally.
    private static final Map<Integer, Long> BOX_INTERVAL_DAYS = Map.of(
        1, 0L, 2, 1L, 3, 3L, 4, 7L, 5, 14L, 6, 30L
    );
    private static final int MASTERED_BOX = 6;
    private static final int SESSION_SIZE = 20;

    public record DueResponse(List<Radical> due, boolean hasProgress) {}
    public record ReviewRequest(String username, Long radicalId, boolean correct) {}
    public record ReviewResponse(boolean success, Integer newBox, String message) {}
    public record SummaryResponse(long totalRadicals, long practiced, long mastered, long dueNow) {}

    private Optional<User> findUser(String username) {
        return userRepository.findByUsername(username);
    }

    @GetMapping("/due")
    public DueResponse due(@RequestParam String username) {
        var userOpt = findUser(username);
        if (userOpt.isEmpty()) {
            return new DueResponse(List.of(), false);
        }
        Long userId = userOpt.get().getId();
        LocalDateTime now = LocalDateTime.now();

        List<Progress> dueProgress = progressRepository.findByUserIdAndNextReviewAtLessThanEqual(userId, now);
        Set<Long> seenRadicalIds = progressRepository.findByUserId(userId).stream()
            .map(Progress::getRadicalId).collect(Collectors.toSet());

        List<Long> dueIds = dueProgress.stream().map(Progress::getRadicalId).collect(Collectors.toList());
        Collections.shuffle(dueIds);

        List<Radical> result = new ArrayList<>();
        for (Long id : dueIds) {
            if (result.size() >= SESSION_SIZE) break;
            radicalRepository.findById(id).ifPresent(result::add);
        }

        // Fill remaining slots with never-seen radicals
        if (result.size() < SESSION_SIZE) {
            List<Radical> all = radicalRepository.findAll();
            Collections.shuffle(all);
            for (Radical r : all) {
                if (result.size() >= SESSION_SIZE) break;
                if (!seenRadicalIds.contains(r.getId()) && result.stream().noneMatch(x -> x.getId().equals(r.getId()))) {
                    result.add(r);
                }
            }
        }

        return new DueResponse(result, !seenRadicalIds.isEmpty());
    }

    @PostMapping("/review")
    public ReviewResponse review(@RequestBody ReviewRequest req) {
        var userOpt = findUser(req.username());
        if (userOpt.isEmpty()) {
            return new ReviewResponse(false, null, "User not found.");
        }
        Long userId = userOpt.get().getId();

        Progress progress = progressRepository.findByUserIdAndRadicalId(userId, req.radicalId())
            .orElseGet(() -> {
                Progress p = new Progress();
                p.setUserId(userId);
                p.setRadicalId(req.radicalId());
                p.setBox(1);
                return p;
            });

        if (req.correct()) {
            progress.setBox(Math.min(progress.getBox() + 1, MASTERED_BOX));
            progress.setTimesCorrect(progress.getTimesCorrect() + 1);
        } else {
            progress.setBox(1);
            progress.setTimesWrong(progress.getTimesWrong() + 1);
        }

        long days = BOX_INTERVAL_DAYS.getOrDefault(progress.getBox(), 1L);
        progress.setLastReviewedAt(LocalDateTime.now());
        progress.setNextReviewAt(LocalDateTime.now().plusDays(days));
        progressRepository.save(progress);

        return new ReviewResponse(true, progress.getBox(), "Saved");
    }

    @GetMapping("/summary")
    public SummaryResponse summary(@RequestParam String username) {
        var userOpt = findUser(username);
        long total = radicalRepository.count();
        if (userOpt.isEmpty()) {
            return new SummaryResponse(total, 0, 0, 0);
        }
        Long userId = userOpt.get().getId();
        List<Progress> all = progressRepository.findByUserId(userId);
        long practiced = all.size();
        long mastered = progressRepository.countByUserIdAndBoxGreaterThanEqual(userId, MASTERED_BOX);
        LocalDateTime now = LocalDateTime.now();
        long dueNow = all.stream().filter(p -> !p.getNextReviewAt().isAfter(now)).count();
        return new SummaryResponse(total, practiced, mastered, dueNow);
    }
}
