package com.meet.library.LMS.repository;

import com.meet.library.LMS.entity.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AnnouncementRepo extends JpaRepository<Announcement,Long> {

    List<Announcement> findByCreatedAtAfter(LocalDateTime time);
    List<Announcement> findByOrderByCreatedAtDesc();

    @Modifying
    @Transactional
    void deleteByCreatedAtBefore(LocalDateTime time);

    Long countByReadFalse();

    Optional<Announcement> findByAnnouncementId(Long id);
}
