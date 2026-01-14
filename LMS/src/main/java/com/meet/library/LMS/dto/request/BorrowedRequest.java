package com.meet.library.LMS.dto.request;



import com.meet.library.LMS.validation.OnCreate;
import jakarta.validation.constraints.NotBlank;

import java.util.Set;

public record BorrowedRequest(
        @NotBlank(groups = OnCreate.class,message = "User id is required for borrowed request")
        Long userId,
        @NotBlank(groups = OnCreate.class,message = "Book id is required for borrowed request")
        Long bookId
) {
}
