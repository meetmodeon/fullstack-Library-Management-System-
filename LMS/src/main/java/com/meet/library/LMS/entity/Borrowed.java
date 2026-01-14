package com.meet.library.LMS.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.meet.library.LMS.enums.BorrowedStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
public class Borrowed {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long borrowedId;
    @JsonFormat(shape = JsonFormat.Shape.STRING,pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime borrowedDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING,pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime returnedDate;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id",nullable = false)
    @JsonManagedReference
    private Book book;

    @Enumerated(value = EnumType.STRING)
    private BorrowedStatus status;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id",nullable = false)
    @JsonManagedReference
    private User user;

}
