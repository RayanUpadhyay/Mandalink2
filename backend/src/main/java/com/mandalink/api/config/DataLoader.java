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

    @Override
    public void run(String... args) throws Exception {
        if (radicalRepository.count() > 0) {
            return;
        }

        List<Radical> radicals = new ArrayList<>();
        ClassPathResource resource = new ClassPathResource("data/radicals.csv");
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {
            String line = reader.readLine();
            boolean first = true;
            while ((line = reader.readLine()) != null) {
                if (line.isBlank()) continue;
                String[] parts = line.split(",", -1);
                if (parts.length < 4) continue;
                try {
                    Integer no = parts[1].isBlank() ? null : Integer.parseInt(parts[1].trim());
                    String character = parts[2].trim();
                    String pinyin = parts[3].trim();
                    String meaning = parts.length > 4 ? parts[4].trim() : "";
                    if (character.isBlank()) continue;
                    radicals.add(new Radical(no, character, pinyin, meaning));
                } catch (NumberFormatException ignored) {
                    // skip malformed row
                }
            }
        }

        radicalRepository.saveAll(radicals);
        System.out.println("Loaded " + radicals.size() + " radicals into the database.");
    }
}
