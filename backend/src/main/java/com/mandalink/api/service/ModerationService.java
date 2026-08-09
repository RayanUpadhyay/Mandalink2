package com.mandalink.api.service;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Pattern;

@Service
public class ModerationService {

    public record ModerationResult(boolean allowed, String reason) {}

    // Deliberately a starter list, not exhaustive — catches the most common
    // English profanity via word-boundary matching so it doesn't false-positive
    // on things like "class" or "assist". Easy to extend later.
    private static final List<String> BLOCKED_WORDS = List.of(
        "fuck", "shit", "bitch", "asshole", "bastard", "cunt", "dick", "piss",
        "slut", "whore", "faggot", "nigger", "nigga", "retard", "rape", "molest"
    );

    private static final List<Pattern> BLOCKED_PATTERNS = BLOCKED_WORDS.stream()
        .map(w -> Pattern.compile("\\b" + Pattern.quote(w) + "\\w*\\b", Pattern.CASE_INSENSITIVE))
        .toList();

    // Catches http(s) links, www., and bare domain-looking strings like "site.com"
    private static final Pattern URL_PATTERN = Pattern.compile(
        "(https?://\\S+)|(www\\.\\S+)|(\\b[a-z0-9-]+\\.(com|net|org|io|xyz|gg|co|link|biz|info)\\b)",
        Pattern.CASE_INSENSITIVE
    );

    // Catches spammy repeated characters, e.g. "aaaaaaaaaa" or "!!!!!!!!!!"
    private static final Pattern REPEATED_CHAR_SPAM = Pattern.compile("(.)\\1{7,}");

    public ModerationResult checkText(String text) {
        if (text == null || text.isBlank()) {
            return new ModerationResult(true, null);
        }

        for (Pattern p : BLOCKED_PATTERNS) {
            if (p.matcher(text).find()) {
                return new ModerationResult(false, "Please remove inappropriate language.");
            }
        }

        if (URL_PATTERN.matcher(text).find()) {
            return new ModerationResult(false, "Links aren't allowed here.");
        }

        if (REPEATED_CHAR_SPAM.matcher(text).find()) {
            return new ModerationResult(false, "That looks like spam — try writing normally.");
        }

        return new ModerationResult(true, null);
    }
}
