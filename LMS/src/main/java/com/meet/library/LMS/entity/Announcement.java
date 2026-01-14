package com.meet.library.LMS.entity;

import com.meet.library.LMS.enums.AnnouncementType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long announcementId;
    private String title;
    @Column(columnDefinition = "TEXT")
    private String message;
    @Enumerated(EnumType.STRING)
    private AnnouncementType type;
    @Column(name = "is_read",nullable = false)
    boolean read;
    LocalDateTime createdAt;
}
