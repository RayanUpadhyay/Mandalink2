package com.mandalink.api.controller;

import com.mandalink.api.service.EmailService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/support")
public class SupportController {

    private final EmailService emailService;

    public SupportController(EmailService emailService) {
        this.emailService = emailService;
    }

    public record ContactRequest(String email) {}
    public record ContactResponse(boolean success, String message) {}

    @PostMapping("/contact")
    public ContactResponse contact(@RequestBody ContactRequest req) {
        if (req.email() == null || req.email().isBlank()) {
            return new ContactResponse(false, "Enter your email so we can get back to you.");
        }

        boolean emailed = emailService.sendSupportRequestEmail(req.email());

        if (emailed) {
            return new ContactResponse(true, "Thanks! We'll get back to you soon.");
        } else {
            return new ContactResponse(false,
                "Support email isn't configured yet — please email mandalinksupport@gmail.com directly for now.");
        }
    }
}
