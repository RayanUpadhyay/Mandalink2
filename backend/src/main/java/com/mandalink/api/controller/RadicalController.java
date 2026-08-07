package com.mandalink.api.controller;

import com.mandalink.api.model.Radical;
import com.mandalink.api.repository.RadicalRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/radicals")
public class RadicalController {

    private final RadicalRepository radicalRepository;

    public RadicalController(RadicalRepository radicalRepository) {
        this.radicalRepository = radicalRepository;
    }

    // tier -> [minNo, maxNo], matching the order entries were added in (rough
    // frequency-based difficulty proxy since we don't have stroke-count data).
    private int[] tierRange(int tier) {
        return switch (tier) {
            case 1 -> new int[]{1, 214};      // Core Kangxi radicals
            case 2 -> new int[]{215, 734};    // Most common characters
            case 3 -> new int[]{735, 1784};   // Common characters
            case 4 -> new int[]{1785, 5000};  // Advanced / less common
            default -> new int[]{1, 5000};
        };
    }

    @GetMapping
    public List<Radical> list(@RequestParam(required = false) String q,
                               @RequestParam(required = false) Integer tier) {
        List<Radical> results;
        if (q == null || q.isBlank()) {
            if (tier == null) {
                results = radicalRepository.findAll();
            } else {
                int[] range = tierRange(tier);
                results = radicalRepository.findByRadicalNoBetween(range[0], range[1]);
            }
        } else {
            results = radicalRepository
                .findByCharacterContainingOrPinyinContainingIgnoreCaseOrMeaningContainingIgnoreCase(q, q, q);
            if (tier != null) {
                int[] range = tierRange(tier);
                results = results.stream()
                    .filter(r -> r.getRadicalNo() != null && r.getRadicalNo() >= range[0] && r.getRadicalNo() <= range[1])
                    .collect(Collectors.toList());
            }
        }
        return results;
    }

    @GetMapping("/random")
    public Radical random() {
        List<Radical> all = radicalRepository.findAll();
        if (all.isEmpty()) return null;
        return all.get((int) (Math.random() * all.size()));
    }

    @GetMapping("/count")
    public Map<String, Long> count() {
        return Map.of("count", radicalRepository.count());
    }

    @GetMapping("/of-the-day")
    public Radical ofTheDay() {
        long total = radicalRepository.count();
        if (total == 0) return null;
        long daysSinceEpoch = LocalDate.now().toEpochDay();
        int pageIndex = (int) (daysSinceEpoch % total);
        Page<Radical> page = radicalRepository.findAll(PageRequest.of(pageIndex, 1));
        return page.hasContent() ? page.getContent().get(0) : null;
    }
}
