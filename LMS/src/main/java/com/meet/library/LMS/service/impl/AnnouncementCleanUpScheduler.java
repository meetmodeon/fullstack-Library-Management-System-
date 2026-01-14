package com.meet.library.LMS.service.impl;

import com.meet.library.LMS.repository.AnnouncementRepo;
import com.meet.library.LMS.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class AnnouncementCleanUpScheduler {

    private final AnnouncementRepo announcementRepo;
    private final AnnouncementService announcementService;

    @Scheduled(fixedRate = 1000*60*60*24*6)
    @Async("taskExecutor")
    public void deleteExpireStories(){
        LocalDateTime expiryTime=LocalDateTime.now().minusHours(48);
        announcementRepo.deleteByCreatedAtBefore(expiryTime);
        announcementService.getUnreadCount();
        log.info("Expire announcement deleted before {}",expiryTime);
    }
}
