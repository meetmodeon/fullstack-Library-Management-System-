package com.meet.library.LMS.service;

import com.meet.library.LMS.dto.request.AnnouncementRequest;
import com.meet.library.LMS.dto.response.AnnouncementResponse;

import java.util.List;
import java.util.Map;

public interface AnnouncementService {
    AnnouncementResponse createAnnouncement(AnnouncementRequest request);
    List<AnnouncementResponse> getAllAnnouncement();
    void deleteAnnouncement(Long announcementId);
    Map<String,Long>  getUnreadCount();
    void markAsRead(Long id);

}
