package com.mandalink.api.controller;

import com.mandalink.api.model.PageView;
import com.mandalink.api.repository.PageViewRepository;
import com.mandalink.api.service.JwtService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final PageViewRepository pageViewRepository;
    private final JwtService jwtService;

    public AnalyticsController(PageViewRepository pageViewRepository, JwtService jwtService) {
        this.pageViewRepository = pageViewRepository;
        this.jwtService = jwtService;
    }

    public record TrackRequest(String sessionId, String path) {}
    public record TrackResponse(boolean success) {}

    @PostMapping("/track")
    public TrackResponse track(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                @RequestBody TrackRequest req) {
        if (req.sessionId() == null || req.sessionId().isBlank() || req.path() == null) {
            return new TrackResponse(false);
        }

        String username = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtService.isValid(token)) {
                username = jwtService.extractUsername(token);
            }
        }

        PageView pv = new PageView();
        pv.setSessionId(req.sessionId());
        pv.setUsername(username);
        pv.setPath(req.path());
        pageViewRepository.save(pv);

        return new TrackResponse(true);
    }
}
