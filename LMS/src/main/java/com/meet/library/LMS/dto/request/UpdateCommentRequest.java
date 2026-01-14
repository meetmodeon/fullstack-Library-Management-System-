package com.meet.library.LMS.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateCommentRequest(
        @NotNull(message = "Rating id is required field")
        Long id,

        @Size(max = 5000,message = "Max length of the comment is 5000")
        String oldComment,
        @Size(max = 5000,message = "Max length of the comment is 5000")
        String updateComment
) {
}
