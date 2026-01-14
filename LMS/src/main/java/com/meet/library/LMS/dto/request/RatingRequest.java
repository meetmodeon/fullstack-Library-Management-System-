package com.meet.library.LMS.dto.request;

import com.meet.library.LMS.validation.OnCreate;
import jakarta.validation.constraints.*;

import java.util.List;

public record RatingRequest(
        @Positive(groups = OnCreate.class,message = "User id is required field")
        @NotNull(groups = OnCreate.class,message = "Please give atleast 1 value of userId")
        Long userId,
        @Positive(groups = OnCreate.class,message = "Book id is required field")
        @NotNull(groups = OnCreate.class,message = "Please give atleast 1 value of bookId")
        Long bookId,
        @Max(groups = OnCreate.class,value = 5,message = "Max value of rating is 5")
        @Min(groups = OnCreate.class,value = 0,message = "Min value of rating is 0")
        Integer rating,
        List<String> comment) {
}
