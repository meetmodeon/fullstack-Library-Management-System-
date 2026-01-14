package com.meet.library.LMS.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.meet.library.LMS.enums.BookStatus;
import com.meet.library.LMS.exception.BadRequestException;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Entity
@Builder
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookId;
    private String name;
    @Column(name = "isbn",unique = true)
    private String isbn;

    @ElementCollection
    @CollectionTable(name = "book_authors",joinColumns = @JoinColumn(name = "book_id"))
    @Column(name = "author")
    private Set<String> author=new HashSet<>();

    @Lob
    @Column(nullable = true)
    @Size(max = 5000)
    private String detail;
    private String bookImagePath;
    private String bookPdfPath;
    @Column(nullable = false)
    private String publication;
    @ManyToOne
    @JsonBackReference
    private SubCategory subCategories;
    @Column(nullable = false)
    private BigDecimal averageRating=new BigDecimal(0L);

    @Enumerated(EnumType.STRING)
    private BookStatus bookStatus;
    @OneToMany(mappedBy = "book",cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonManagedReference
    private List<RatingFeedback> ratingFeedbacks=new ArrayList<>();

    @OneToMany(mappedBy = "book",cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonBackReference
    private List<Borrowed> borrowedList=new ArrayList<>();


    public void addRatingFeedback(RatingFeedback ratingFeedbackDto){
            ratingFeedbacks.add(ratingFeedbackDto);
            ratingFeedbackDto.setBook(this);
    }
    public void removeRatingFeedback(RatingFeedback ratingFeedbackDto){

            ratingFeedbacks.remove(ratingFeedbackDto);
            ratingFeedbackDto.setBook(null);
    }

    public void addBorrowed(Borrowed borrowed){
        borrowed.setBook(this);
        borrowedList.add(borrowed);
    }

    public void removeBorrowed(Borrowed borrowed){
        borrowedList.remove(borrowed);
        borrowed.setBook(null);
    }


}
