package com.meet.library.LMS.service.impl;

import com.meet.library.LMS.dto.request.AnnouncementRequest;
import com.meet.library.LMS.dto.response.AnnouncementResponse;
import com.meet.library.LMS.entity.Announcement;
import com.meet.library.LMS.enums.AnnouncementType;
import com.meet.library.LMS.repository.AnnouncementRepo;
import com.meet.library.LMS.service.AnnouncementService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepo announcementRepo;
    private final SimpMessagingTemplate messagingTemplate;
    @Override
    @Transactional
    public AnnouncementResponse createAnnouncement(AnnouncementRequest request) {
        Announcement announcement=new Announcement();
        announcement.setTitle(request.title());
        announcement.setMessage(request.message());
        announcement.setType(request.type());
        announcement.setCreatedAt(LocalDateTime.now());
        announcement.setRead(false);
        Announcement returnDto=announcementRepo.save(announcement);
        AnnouncementResponse response=new AnnouncementResponse(returnDto);
        Map<String,AnnouncementResponse> map=new HashMap<>();
        map.put("response",response);
        messagingTemplate.convertAndSend(
                "/topic/getNewNotification",
               map
        );
        return response;
    }

    @Override
    public List<AnnouncementResponse> getAllAnnouncement() {
        List<Announcement> announcementList=announcementRepo.findByOrderByCreatedAtDesc();
        if(announcementList.isEmpty()){
            return new ArrayList<>();
        }
        List<AnnouncementResponse> responsesList=announcementList.stream().map(a-> new AnnouncementResponse(a)).collect(Collectors.toList());
        Map<String,List<AnnouncementResponse>> map=new HashMap<>();
        map.put("listResponse",responsesList);
        log.info("response list data: {}",responsesList);
        getUnreadCount();
        messagingTemplate.convertAndSend(
                "/topic/getAllNotification",
               map
        );
        return responsesList;
    }


    @Override
    @Transactional
    public void deleteAnnouncement(Long announcementId) {
        if(announcementId != null ){
            Optional<Announcement> optionalAnnouncement=announcementRepo.findById(announcementId);
            if(optionalAnnouncement.isPresent()){
                announcementRepo.deleteById(announcementId);
            }else{
                throw new EntityNotFoundException("No any Announcement is found");
            }
        }
    }

    @Override
    public Map<String, Long> getUnreadCount() {
        Long count=announcementRepo.countByReadFalse();
        Map<String,Long> response=new HashMap<>();
        response.put("count",count);
        log.info("Get total unread count: {}",count);
        messagingTemplate.convertAndSend(
                "/topic/getCount",
                response
        );
        return response;
    }

    @Override
    @Transactional
    public void markAsRead(Long id) {
        announcementRepo.findByAnnouncementId(id).ifPresent(r->{
            r.setRead(true);
            announcementRepo.save(r);
        });
        getUnreadCount();
    }
}
