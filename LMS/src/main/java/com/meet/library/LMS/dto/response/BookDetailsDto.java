package com.meet.library.LMS.dto.response;

import com.meet.library.LMS.enums.BookStatus;
import com.meet.library.LMS.enums.BorrowedStatus;

import java.time.LocalDateTime;
import java.util.List;

public record BookDetailsDto(
        Long bookId,
        String name,
        String authors,
        double rating,
        int ratingCount,
        BookStatus bookStatus,
        String detail,
        String categoryName,
        String borrowedDuration,
        int borrowedCount
) {
}
