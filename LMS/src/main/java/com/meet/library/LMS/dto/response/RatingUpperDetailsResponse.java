package com.meet.library.LMS.dto.response;

public record RatingUpperDetailsResponse(

        Double avgRating,
        Long rating_1,
        Long rating_2,
        Long rating_3,
        Long rating_4,
        Long rating_5,
        Long totalReviewNo
) {
}
