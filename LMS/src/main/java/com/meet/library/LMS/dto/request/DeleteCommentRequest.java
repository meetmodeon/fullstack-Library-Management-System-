package com.meet.library.LMS.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DeleteCommentRequest(
        @NotNull(message = "Rating id is required field")
        Long id,
        @Size(max = 5000,message = "comment max size is 5000")
        String comment
) {
}
