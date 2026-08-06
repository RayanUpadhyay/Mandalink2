package com.mandalink.api.config;

import com.mandalink.api.model.Radical;
import com.mandalink.api.repository.RadicalRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final RadicalRepository radicalRepository;

    public DataLoader(RadicalRepository radicalRepository) {
        this.radicalRepository = radicalRepository;
    }

    /**
     * Minimal quote-aware CSV line splitter. Handles fields wrapped in double
     * quotes that may themselves contain commas (e.g. "長 (镸, 长)"), which a
     * naive line.split(",") would incorrectly break apart.
     */
    private List<String> parseCsvLine(String line) {
        List<String> fields = new ArrayList<>();
        StringBuilder field = new StringBuilder();
        boolean inQuotes = false;
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                fields.add(field.toString());
                field.setLength(0);
            } else {
                field.append(c);
            }
        }
        fields.add(field.toString());
        return fields;
    }

    @Override
    public void run(String... args) throws Exception {
        // Incremental import: only add rows whose radicalNo isn't already in the
        // database, so growing radicals.csv over time and redeploying just works
        // without needing to wipe the table first.
        List<Radical> newRadicals = new ArrayList<>();
        ClassPathResource resource = new ClassPathResource("data/radicals.csv");
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            String line = reader.readLine();
            while ((line = reader.readLine()) != null) {
                if (line.isBlank()) continue;
                List<String> parts = parseCsvLine(line);
                if (parts.size() < 4) continue;
                try {
                    String noRaw = parts.get(1).trim();
                    Integer no = noRaw.isBlank() ? null : Integer.parseInt(noRaw);
                    String character = parts.get(2).trim();
                    String pinyin = parts.get(3).trim();
                    String meaning = parts.size() > 4 ? parts.get(4).trim() : "";
                    if (character.isBlank()) continue;
                    if (no != null && radicalRepository.existsByRadicalNo(no)) continue;
                    newRadicals.add(new Radical(no, character, pinyin, meaning));
                } catch (NumberFormatException ignored) {
                    // skip malformed row
                }
            }
        }

        if (!newRadicals.isEmpty()) {
            radicalRepository.saveAll(newRadicals);
            System.out.println("Loaded " + newRadicals.size() + " new radicals into the database.");
        } else {
            System.out.println("No new radicals to load — database already up to date.");
        }
    }
}
