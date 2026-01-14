package com.meet.library.LMS.dto.response;

import com.meet.library.LMS.entity.Announcement;
import com.meet.library.LMS.enums.AnnouncementType;

import java.time.LocalDateTime;

public record AnnouncementResponse(
        Long announcementId,
        String title,
        String message,
        AnnouncementType type,
        boolean read,
        LocalDateTime createdAt
) {

    public AnnouncementResponse(Announcement announcement){
        this(
                announcement.getAnnouncementId(),
                announcement.getTitle(),
                announcement.getMessage(),
                announcement.getType(),
                announcement.isRead(),
                announcement.getCreatedAt());
    }
}
