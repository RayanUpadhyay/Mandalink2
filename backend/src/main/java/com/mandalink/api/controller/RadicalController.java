package com.mandalink.api.controller;

import com.mandalink.api.model.Radical;
import com.mandalink.api.repository.RadicalRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/radicals")
public class RadicalController {

    private final RadicalRepository radicalRepository;

    public RadicalController(RadicalRepository radicalRepository) {
        this.radicalRepository = radicalRepository;
    }

    @GetMapping
    public List<Radical> list(@RequestParam(required = false) String q) {
        if (q == null || q.isBlank()) {
            return radicalRepository.findAll();
        }
        return radicalRepository
            .findByCharacterContainingOrPinyinContainingIgnoreCaseOrMeaningContainingIgnoreCase(q, q, q);
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
}
