package com.meet.library.LMS.dto.response;

import com.meet.library.LMS.entity.Book;
import com.meet.library.LMS.entity.Borrowed;
import com.meet.library.LMS.entity.User;
import com.meet.library.LMS.enums.BorrowedStatus;


import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;


public record BorrowedResponse(
        Long borrowedId,
        LocalDateTime borrowedDate,
        LocalDateTime returnedDate,
        String remainingReturnDate,
        Long bookId,
        BorrowedStatus status,
        Long userId) {
    public BorrowedResponse(Borrowed borrowed){
        this(borrowed.getBorrowedId(),borrowed.getBorrowedDate(),borrowed.getReturnedDate(),getRemainingTime(borrowed.getReturnedDate()),borrowed.getBook().getBookId(),borrowed.getStatus(),borrowed.getUser().getUserId());
    }



    public static String getRemainingTime(LocalDateTime returnDate){
        LocalDateTime now= LocalDateTime.now();

        if(now.isAfter(returnDate)){
            return "Expired";
        }
        Duration duration=Duration.between(now,returnDate);

        long days=duration.toDays();
        long hours=duration.toHours()%24;
        long minutes=duration.toMinutes()%60;
        long seconds=duration.getSeconds()%60;

        return String.format(
                "%d days %02d:%02d:%02d",
                days,hours,minutes,seconds
        );

    }


}
