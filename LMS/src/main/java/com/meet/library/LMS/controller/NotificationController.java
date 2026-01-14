package com.meet.library.LMS.controller;

import com.meet.library.LMS.dto.request.AnnouncementRequest;
import com.meet.library.LMS.dto.response.AnnouncementResponse;
import com.meet.library.LMS.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/notification")
public class NotificationController {
    private final AnnouncementService announcementService;
    @PostMapping
    public ResponseEntity<AnnouncementResponse> postAnnouncement(@RequestBody AnnouncementRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(announcementService.createAnnouncement(request));
    }
}
