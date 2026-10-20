package com.mandalink.api.controller;

import com.mandalink.api.model.Announcement;
import com.mandalink.api.repository.AnnouncementImageRepository;
import com.mandalink.api.repository.AnnouncementRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Set;

// PUBLIC, read-only. This is what both the Mandalink announcement board and
// the embed on rayanupadhyay.com read from, so the two sites always match.
// CORS for /api/announcements/** is opened up in SecurityConfig (GET only,
// no credentials) so another website can fetch it from the browser.
@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    public static final Set<String> CATEGORIES = Set.of("mandalink", "rayanupadhyay", "other");

    private final AnnouncementRepository announcementRepository;
    private final AnnouncementImageRepository imageRepository;

    public AnnouncementController(AnnouncementRepository announcementRepository,
                                  AnnouncementImageRepository imageRepository) {
        this.announcementRepository = announcementRepository;
        this.imageRepository = imageRepository;
    }

    public record PublicAnnouncement(Long id, String title, String body, String category,
                                     boolean pinned, String imagePath, LocalDateTime createdAt) {}

    // Relative path to the image (with a version stamp so a replaced image
    // isn't served stale from cache). Clients prefix it with the API base URL.
    public static String imagePathFor(Announcement a) {
        if (!Boolean.TRUE.equals(a.getHasImage())) return null;
        return "/api/announcements/" + a.getId() + "/image?v=" + a.getUpdatedAt().toEpochSecond(ZoneOffset.UTC);
    }

    private static PublicAnnouncement toPublic(Announcement a) {
        return new PublicAnnouncement(a.getId(), a.getTitle(), a.getBody(), a.getCategory(),
            Boolean.TRUE.equals(a.getPinned()), imagePathFor(a), a.getCreatedAt());
    }

    @GetMapping
    public List<PublicAnnouncement> list(@RequestParam(required = false) String category,
                                         @RequestParam(required = false) Integer limit) {
        String cat = category == null ? "" : category.trim().toLowerCase();
        boolean filter = !cat.isEmpty() && !cat.equals("all");
        int max = limit == null ? 50 : Math.max(1, Math.min(limit, 100));

        // Pinned first, then newest first.
        Sort order = Sort.by(Sort.Order.desc("pinned"), Sort.Order.desc("createdAt"));
        return announcementRepository.findAll(order).stream()
            .filter(a -> !filter || a.getCategory().equals(cat))
            .limit(max)
            .map(AnnouncementController::toPublic)
            .toList();
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> image(@PathVariable Long id) {
        return imageRepository.findByAnnouncementId(id)
            .map(img -> ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(img.getContentType()))
                .cacheControl(CacheControl.maxAge(Duration.ofDays(1)).cachePublic())
                .header("X-Content-Type-Options", "nosniff")
                .body(img.getData()))
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
