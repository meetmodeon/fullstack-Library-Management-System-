package com.meet.library.LMS.dto.response;

import com.meet.library.LMS.entity.RatingFeedback;

import java.time.LocalDateTime;
import java.util.List;

public record RatingFeedbackDetailResponse (
        Long id,

        Integer rating,


        Long userId,


        List<String> comment,


        LocalDateTime updatedAt,

        Boolean active
){

    public RatingFeedbackDetailResponse(RatingFeedback r){
        this(r.getId(), r.getRating(),r.getUser().getUserId(),r.getComment(),r.getUpdatedAt(),r.getActive());
    }

}
