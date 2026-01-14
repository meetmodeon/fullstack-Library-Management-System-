package com.meet.library.LMS.dto.response;

import com.meet.library.LMS.enums.BookStatus;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class BookDetailResponse {
    private Long id;
    private String name;
    private String authors;
    private String detail;
    private BigDecimal avgRating;
    private Long ratingCount;
    private BookStatus bookStatus;
    private Long borrowedCount;
    private String categoryName;

    public BookDetailResponse(
            Long id, String name, String detail, BigDecimal avgRating, Long ratingCount, BookStatus bookStatus, Long borrowedCount, String categoryName) {
        this.id = id;
        this.name = name;
        this.detail = detail;
        this.avgRating = avgRating;
        this.ratingCount = ratingCount;
        this.bookStatus = bookStatus;
        this.borrowedCount = borrowedCount;
        this.categoryName = categoryName;
    }
}
