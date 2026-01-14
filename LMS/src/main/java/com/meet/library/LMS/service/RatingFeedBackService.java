package com.meet.library.LMS.service;

import com.meet.library.LMS.dto.response.RatingFeedBackResponse;
import com.meet.library.LMS.dto.request.RatingRequest;
import com.meet.library.LMS.dto.response.RatingFeedbackDetailResponse;
import com.meet.library.LMS.dto.response.RatingUpperDetailsResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface RatingFeedBackService {
    RatingFeedBackResponse createBookRating(RatingRequest request);
    void deleteFeedBack(Long ratingId,Long userId,Long BookId);
    void addComment(Long ratingId,String comment);
    Page<RatingFeedBackResponse> getRatingFeedBackByBookId(Long bookId, Pageable pageable);
    BigDecimal getAverageRating(Long bookId);
//    Long updateLikesAndDislike(Long ratingId,String likeOrDislike);
    String updateComment(Long ratingId,String oldComment,String updatedComment);
    void deleteComment(Long ratingId,String deleteComment);

    List<RatingFeedbackDetailResponse> getAllRatingBasedOnBookId(Long bookId, Long cursor, int limit);


    RatingUpperDetailsResponse getRatingDetailsByBookId(Long bookId);
}
