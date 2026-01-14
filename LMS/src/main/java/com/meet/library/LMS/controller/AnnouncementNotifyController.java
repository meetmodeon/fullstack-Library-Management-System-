package com.meet.library.LMS.controller;

import com.meet.library.LMS.dto.request.AnnouncementRequest;
import com.meet.library.LMS.dto.response.AnnouncementResponse;
import com.meet.library.LMS.service.AnnouncementService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@Controller
@RequiredArgsConstructor
public class AnnouncementNotifyController {
    private final AnnouncementService announcementService;

    @MessageMapping("/send/notification")
    public ResponseEntity<AnnouncementResponse> postAnnouncement(@RequestBody AnnouncementRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(announcementService.createAnnouncement(request));
    }

    @MessageMapping("send/allNotification")
    public List<AnnouncementResponse> getAll() {
        return announcementService.getAllAnnouncement();
    }

   @MessageMapping("/send/unreadCount")
    public Map<String, Long> unreadCount() {
        return announcementService.getUnreadCount();
    }

    @PutMapping("/{id}/read")
    public void markRead(@PathVariable Long id) {
        announcementService.markAsRead(id);
    }

}
