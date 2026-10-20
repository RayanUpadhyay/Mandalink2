package com.mandalink.api.controller;

import com.mandalink.api.model.Announcement;
import com.mandalink.api.model.AnnouncementImage;
import com.mandalink.api.model.User;
import com.mandalink.api.repository.AnnouncementImageRepository;
import com.mandalink.api.repository.AnnouncementRepository;
import com.mandalink.api.repository.UserRepository;
import com.mandalink.api.service.JwtService;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Set;

// ADMIN ONLY. Same check as the rest of the admin panel: a valid JWT whose
// account actually has isAdmin=true in the database — never a client-supplied name.
@RestController
@RequestMapping("/api/admin/announcements")
public class AnnouncementAdminController {

    private static final int MAX_TITLE = 120;
    private static final int MAX_BODY = 600;
    private static final int MAX_IMAGE_BYTES = 2 * 1024 * 1024;
    private static final int MAX_DATA_URI_CHARS = 3_000_000;
    private static final Set<String> IMAGE_TYPES = Set.of("image/jpeg", "image/png", "image/webp");

    private final AnnouncementRepository announcementRepository;
    private final AnnouncementImageRepository imageRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public AnnouncementAdminController(AnnouncementRepository announcementRepository,
                                       AnnouncementImageRepository imageRepository,
                                       UserRepository userRepository, JwtService jwtService) {
        this.announcementRepository = announcementRepository;
        this.imageRepository = imageRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    private User verifyAdmin(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        String token = authHeader.substring(7);
        if (!jwtService.isValid(token)) return null;
        String username = jwtService.extractUsername(token);
        return userRepository.findByUsername(username)
            .filter(u -> Boolean.TRUE.equals(u.getIsAdmin()))
            .orElse(null);
    }

    public record AdminAnnouncement(Long id, String title, String body, String category, boolean pinned,
                                    String imagePath, LocalDateTime createdAt, LocalDateTime updatedAt,
                                    String authorUsername) {}
    public record ListResponse(boolean success, String message, List<AdminAnnouncement> announcements) {}
    public record SaveRequest(String title, String body, String category, Boolean pinned,
                              String imageDataUri, Boolean removeImage) {}
    public record SaveResponse(boolean success, String message, AdminAnnouncement announcement) {}
    public record DeleteResponse(boolean success, String message) {}

    private record DecodedImage(String contentType, byte[] data) {}

    private static AdminAnnouncement toAdmin(Announcement a) {
        return new AdminAnnouncement(a.getId(), a.getTitle(), a.getBody(), a.getCategory(),
            Boolean.TRUE.equals(a.getPinned()), AnnouncementController.imagePathFor(a),
            a.getCreatedAt(), a.getUpdatedAt(), a.getAuthorUsername());
    }

    private static SaveResponse fail(String message) {
        return new SaveResponse(false, message, null);
    }

    // The declared type has to match the file's real leading bytes, so this
    // can't be used to park arbitrary data (or script-bearing SVG) in the table.
    private static boolean looksLike(String type, byte[] b) {
        if (b.length < 12) return false;
        switch (type) {
            case "image/jpeg":
                return (b[0] & 0xFF) == 0xFF && (b[1] & 0xFF) == 0xD8 && (b[2] & 0xFF) == 0xFF;
            case "image/png":
                return (b[0] & 0xFF) == 0x89 && b[1] == 'P' && b[2] == 'N' && b[3] == 'G';
            case "image/webp":
                return b[0] == 'R' && b[1] == 'I' && b[2] == 'F' && b[3] == 'F'
                    && b[8] == 'W' && b[9] == 'E' && b[10] == 'B' && b[11] == 'P';
            default:
                return false;
        }
    }

    private static DecodedImage decodeImage(String dataUri) {
        if (dataUri.length() > MAX_DATA_URI_CHARS) {
            throw new IllegalArgumentException("That image is too large — please use a smaller one.");
        }
        int comma = dataUri.indexOf(',');
        if (comma < 0) throw new IllegalArgumentException("That doesn't look like a valid image.");
        String header = dataUri.substring(0, comma).toLowerCase();
        if (!header.startsWith("data:") || !header.endsWith(";base64")) {
            throw new IllegalArgumentException("That doesn't look like a valid image.");
        }
        String type = header.substring(5, header.length() - ";base64".length());
        if (!IMAGE_TYPES.contains(type)) {
            throw new IllegalArgumentException("Only JPEG, PNG or WebP images are allowed.");
        }
        byte[] bytes;
        try {
            bytes = Base64.getDecoder().decode(dataUri.substring(comma + 1));
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("That image couldn't be read.");
        }
        if (bytes.length == 0 || bytes.length > MAX_IMAGE_BYTES) {
            throw new IllegalArgumentException("That image is too large — please use a smaller one.");
        }
        if (!looksLike(type, bytes)) {
            throw new IllegalArgumentException("That file isn't a real " + type.substring(6).toUpperCase() + " image.");
        }
        return new DecodedImage(type, bytes);
    }

    // Shared by create and update. All validation happens BEFORE anything is
    // written, so a rejected request never leaves a half-saved announcement.
    private SaveResponse apply(Announcement a, SaveRequest req) {
        String title = req.title() == null ? "" : req.title().trim();
        String body = req.body() == null ? "" : req.body().trim();
        String category = req.category() == null ? "" : req.category().trim().toLowerCase();
        if (category.isEmpty()) category = "mandalink";

        if (title.isEmpty()) return fail("A title is required.");
        if (title.length() > MAX_TITLE) return fail("Title must be " + MAX_TITLE + " characters or fewer.");
        if (body.length() > MAX_BODY) return fail("The write-up must be " + MAX_BODY + " characters or fewer.");
        if (!AnnouncementController.CATEGORIES.contains(category)) return fail("Pick one of the three categories.");

        DecodedImage image = null;
        if (req.imageDataUri() != null && !req.imageDataUri().isBlank()) {
            try {
                image = decodeImage(req.imageDataUri().trim());
            } catch (IllegalArgumentException e) {
                return fail(e.getMessage());
            }
        }
        boolean removeImage = Boolean.TRUE.equals(req.removeImage());

        a.setTitle(title);
        a.setBody(body);
        a.setCategory(category);
        a.setPinned(Boolean.TRUE.equals(req.pinned()));
        a.setUpdatedAt(LocalDateTime.now());
        if (image != null) {
            a.setHasImage(true);
        } else if (removeImage) {
            a.setHasImage(false);
        }
        Announcement saved = announcementRepository.save(a);

        if (image != null) {
            AnnouncementImage row = imageRepository.findByAnnouncementId(saved.getId())
                .orElseGet(AnnouncementImage::new);
            row.setAnnouncementId(saved.getId());
            row.setContentType(image.contentType());
            row.setData(image.data());
            imageRepository.save(row);
        } else if (removeImage) {
            imageRepository.deleteByAnnouncementId(saved.getId());
        }
        return new SaveResponse(true, "Saved.", toAdmin(saved));
    }

    @GetMapping
    public ListResponse list(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (verifyAdmin(authHeader) == null) return new ListResponse(false, "Not authorized.", null);
        Sort order = Sort.by(Sort.Order.desc("pinned"), Sort.Order.desc("createdAt"));
        List<AdminAnnouncement> rows = announcementRepository.findAll(order).stream()
            .map(AnnouncementAdminController::toAdmin)
            .toList();
        return new ListResponse(true, "OK", rows);
    }

    @Transactional
    @PostMapping
    public SaveResponse create(@RequestHeader(value = "Authorization", required = false) String authHeader,
                               @RequestBody SaveRequest req) {
        User admin = verifyAdmin(authHeader);
        if (admin == null) return fail("Not authorized.");
        Announcement a = new Announcement();
        a.setAuthorUsername(admin.getUsername());
        return apply(a, req);
    }

    @Transactional
    @PutMapping("/{id}")
    public SaveResponse update(@RequestHeader(value = "Authorization", required = false) String authHeader,
                               @PathVariable Long id, @RequestBody SaveRequest req) {
        if (verifyAdmin(authHeader) == null) return fail("Not authorized.");
        var existing = announcementRepository.findById(id);
        if (existing.isEmpty()) return fail("Announcement not found.");
        return apply(existing.get(), req);
    }

    @Transactional
    @DeleteMapping("/{id}")
    public DeleteResponse delete(@RequestHeader(value = "Authorization", required = false) String authHeader,
                                 @PathVariable Long id) {
        if (verifyAdmin(authHeader) == null) return new DeleteResponse(false, "Not authorized.");
        if (!announcementRepository.existsById(id)) return new DeleteResponse(false, "Announcement not found.");
        imageRepository.deleteByAnnouncementId(id);
        announcementRepository.deleteById(id);
        return new DeleteResponse(true, "Deleted.");
    }
}
