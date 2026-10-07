package com.mandalink.api.config;

import com.mandalink.api.model.BadgeDrop;
import com.mandalink.api.repository.BadgeDropRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

// Creates the quest badges earned on rayanupadhyay.com, once. Safe to run on
// every startup: existing badges (and everyone's claims) are left untouched.
@Component
public class QuestBadgeLoader implements CommandLineRunner {

    private static final String[][] QUESTS = {
        // code, icon, name, description
        {"ISLES-LIN-2026", "🏝️", "Islander", "Raised all 12 islands at the radical shrine on rayanupadhyay.com"},
        {"SLAYER-ZI-2026", "⚔️", "Radical Slayer", "Defeated The Scrambler in the screening room on rayanupadhyay.com"},
        {"STACK-0101-2026", "🪂", "Stack Diver", "Fell all the way down the full stack on rayanupadhyay.com"},
        {"WUKONG-HOU-2026", "🐒", "齐天大圣 Great Sage", "Finished the Monkey King story (猴王闹海岛) in Mandalink world on rayanupadhyay.com"}
    };

    private final BadgeDropRepository badgeDropRepository;

    public QuestBadgeLoader(BadgeDropRepository badgeDropRepository) {
        this.badgeDropRepository = badgeDropRepository;
    }

    @Override
    public void run(String... args) {
        for (String[] q : QUESTS) {
            if (badgeDropRepository.findFirstByRedeemCodeIgnoreCase(q[0]).isPresent()) continue;
            BadgeDrop drop = new BadgeDrop();
            drop.setRedeemCode(q[0]);
            drop.setIcon(q[1]);
            drop.setName(q[2]);
            drop.setDescription(q[3]);
            drop.setCreatedAt(LocalDateTime.now());
            drop.setExpiresAt(LocalDateTime.of(2099, 12, 31, 23, 59));
            badgeDropRepository.save(drop);
        }
    }
}
