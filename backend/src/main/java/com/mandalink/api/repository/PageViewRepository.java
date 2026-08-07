package com.mandalink.api.repository;

import com.mandalink.api.model.PageView;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface PageViewRepository extends JpaRepository<PageView, Long> {

    // Distinct active "identities" since a given time — logged-in users are counted by
    // username, anonymous visitors by session ID, so nobody is double-counted or missed.
    @Query("select count(distinct coalesce(p.username, p.sessionId)) from PageView p where p.viewedAt >= :since")
    long countDistinctActiveSince(LocalDateTime since);

    interface PathCount {
        String getPath();
        Long getCnt();
    }

    @Query("select p.path as path, count(p) as cnt from PageView p group by p.path order by count(p) desc")
    List<PathCount> topPaths(Pageable pageable);

    long countByViewedAtAfter(LocalDateTime since);
}
