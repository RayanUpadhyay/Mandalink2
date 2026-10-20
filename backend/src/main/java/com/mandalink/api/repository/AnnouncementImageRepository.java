package com.mandalink.api.repository;

import com.mandalink.api.model.AnnouncementImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface AnnouncementImageRepository extends JpaRepository<AnnouncementImage, Long> {
    Optional<AnnouncementImage> findByAnnouncementId(Long announcementId);

    // Derived delete queries need an active transaction to run.
    @Transactional
    void deleteByAnnouncementId(Long announcementId);
}
