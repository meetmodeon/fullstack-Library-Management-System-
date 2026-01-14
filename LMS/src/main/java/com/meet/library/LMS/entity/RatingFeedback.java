package com.meet.library.LMS.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "rating_feedback")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RatingFeedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private Integer rating=0;


    @ManyToOne
    @JoinColumn(name = "user_id",nullable = false)
    @JsonBackReference
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_id",nullable = false)
    @JsonBackReference
    private Book book;

    @ElementCollection
    @Column(name = "comment",length = 1000)
    private List<String> comment;


    @CreationTimestamp
    private LocalDateTime createdAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private Boolean active=true;


}
