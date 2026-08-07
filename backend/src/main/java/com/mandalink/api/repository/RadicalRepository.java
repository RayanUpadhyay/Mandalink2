package com.mandalink.api.repository;

import com.mandalink.api.model.Radical;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RadicalRepository extends JpaRepository<Radical, Long> {
    List<Radical> findByCharacterContainingOrPinyinContainingIgnoreCaseOrMeaningContainingIgnoreCase(
        String character, String pinyin, String meaning
    );
    boolean existsByRadicalNo(Integer radicalNo);
    List<Radical> findByRadicalNoBetween(Integer min, Integer max);
}
