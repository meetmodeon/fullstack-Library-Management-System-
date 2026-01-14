package com.meet.library.LMS.service.impl;

import com.meet.library.LMS.dto.response.RatingFeedBackResponse;
import com.meet.library.LMS.dto.response.RatingFeedbackDetailResponse;
import com.meet.library.LMS.dto.response.RatingUpperDetailsResponse;
import com.meet.library.LMS.entity.Book;
import com.meet.library.LMS.entity.RatingFeedback;
import com.meet.library.LMS.entity.User;
import com.meet.library.LMS.exception.AlreadyRatedException;
import com.meet.library.LMS.exception.BookNotFoundException;
import com.meet.library.LMS.exception.UserNotFoundException;
import com.meet.library.LMS.repository.BookRepo;
import com.meet.library.LMS.repository.RatingFeedBackRepo;
import com.meet.library.LMS.repository.UserRepo;
import com.meet.library.LMS.dto.request.RatingRequest;
import com.meet.library.LMS.service.RatingFeedBackService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingFeedBackServiceImpl implements RatingFeedBackService {
    private final RatingFeedBackRepo ratingFeedBackRepo;
    private final ModelMapper modelMapper;
    private final BookRepo bookRepo;
    private final UserRepo userRepo;

    @Override
    @Transactional
    public RatingFeedBackResponse createBookRating(RatingRequest request) {
        Optional<RatingFeedback> OptRatingFeedback=ratingFeedBackRepo.findByUserUserIdAndBookBookId(request.bookId(),request.userId());
        if(OptRatingFeedback.isEmpty()) {
            Book book = bookRepo.findByBookId(request.bookId())
                    .orElseThrow(() -> new EntityNotFoundException("Book not found with id:: " + request.bookId()));
            User user = userRepo.findByUserId(request.userId())
                    .orElseThrow(() -> new EntityNotFoundException("User not found with id:: " + request.userId()));
            RatingFeedback ratingFeedback = RatingFeedback
                    .builder()
                    .book(book)
                    .user(user)
                    .rating(
                            request.rating()!=null
                            ? request.rating() : 0
                    )
                    .comment(
                            request.comment().isEmpty()
                            ? List.of()
                                    :request.comment()
                    )
                    .active(true)
                    .build();

            RatingFeedback returnFeedBack = ratingFeedBackRepo.save(ratingFeedback);
            BigDecimal avgRating=getAverageRating(book.getBookId());
            book.addRatingFeedback(ratingFeedback);
            book.setAverageRating(avgRating);
            user.addRating(ratingFeedback);
            RatingFeedBackResponse returnFeedBackDto = new RatingFeedBackResponse(returnFeedBack);
            return returnFeedBackDto;
        }else {
            throw new AlreadyRatedException("User Id: "+request.userId()+" is already rated to the book id: "+request.bookId());
        }
    }



    @Override
    @Transactional
    @Async("taskExecutor")
    public void deleteFeedBack(Long ratingId,Long userId,Long bookId) {
        RatingFeedback ratingFeedback=ratingFeedBackRepo.findByIdAndUserUserIdAndBookBookId(ratingId,userId,bookId)
                        .orElseThrow(()-> new EntityNotFoundException("Unable to delete rating"));
        ratingFeedback.getBook().removeRatingFeedback(ratingFeedback);
        ratingFeedback.getUser().removeRating(ratingFeedback);
       ratingFeedBackRepo.deleteById(ratingId);
    }

    @Override
    public Page<RatingFeedBackResponse> getRatingFeedBackByBookId(Long bookId, Pageable pageable) {
        return ratingFeedBackRepo.findByBookBookId(bookId,pageable).map(RatingFeedBackResponse::new);

    }


     public BigDecimal getAverageRating(Long bookId) {
        Book book=bookRepo.findByBookId(bookId).orElseThrow(()->new RuntimeException("Book not found with id: "+bookId));
        List<RatingFeedback> ratingFeedbacksList=ratingFeedBackRepo.findByBookBookId(bookId);

        double avg=ratingFeedbacksList.stream()
                .mapToInt(RatingFeedback::getRating)
                .average()
                .orElse(0.0);
        return BigDecimal.valueOf(avg).setScale(2,BigDecimal.ROUND_HALF_DOWN);
    }


    @Override
    @Transactional
    public String updateComment(Long ratingId, String oldComment,String updatedComment) {
        RatingFeedback ratingFeedback=getRatingFeedBack(ratingId);
        List<String> com=ratingFeedback.getComment().stream().map(comment->comment.equals(oldComment)?updatedComment:comment).collect(Collectors.toList());
        ratingFeedback.setComment(com);
        ratingFeedback.setUpdatedAt(LocalDateTime.now());
        return updatedComment;
    }

    @Override
    @Transactional
    public void addComment(Long ratingId,String comment){
        RatingFeedback ratingFeedback=getRatingFeedBack(ratingId);
        List<String> com=ratingFeedback.getComment();
        com.add(comment);

    }

    @Override
    @Transactional
    public void deleteComment(Long ratingId, String deleteComment) {
        RatingFeedback ratingFeedback=getRatingFeedBack(ratingId);
        List<String> comments=ratingFeedback.getComment().stream().filter(item->!item.equals(deleteComment)).collect(Collectors.toList());
        ratingFeedback.setComment(comments);
    }

    @Override
    public List<RatingFeedbackDetailResponse> getAllRatingBasedOnBookId(Long bookId, Long cursor, int limit) {

        List<RatingFeedback> ratingFeedbacks=ratingFeedBackRepo.findRatingByBookId(
                bookId,
                cursor,
                PageRequest.of(0,limit)
        );

        List<RatingFeedbackDetailResponse> dtoList= ratingFeedbacks.stream()
                .map(RatingFeedbackDetailResponse::new).collect(Collectors.toList());
        return dtoList;
    }

    @Override
    public RatingUpperDetailsResponse getRatingDetailsByBookId(Long bookId) {
        Double avgRating = bookRepo.findByBookId(bookId)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + bookId))
                .getAverageRating()
                .doubleValue();

        Map<String, Object> objectMap = ratingFeedBackRepo.countRatingRanges(bookId);

        Long rating_1 = objectMap.get("1") != null ? ((BigDecimal) objectMap.get("1")).longValue() : 0L;
        Long rating_2 = objectMap.get("2") != null ? ((BigDecimal) objectMap.get("2")).longValue() : 0L;
        Long rating_3 = objectMap.get("3") != null ? ((BigDecimal) objectMap.get("3")).longValue() : 0L;
        Long rating_4 = objectMap.get("4") != null ? ((BigDecimal) objectMap.get("4")).longValue() : 0L;
        Long rating_5 = objectMap.get("5") != null ? ((BigDecimal) objectMap.get("5")).longValue() : 0L;

        Long totalReview = ratingFeedBackRepo.countByBookBookId(bookId);

        return new RatingUpperDetailsResponse(
                avgRating, rating_1, rating_2, rating_3, rating_4, rating_5, totalReview
        );
    }


    private RatingFeedback getRatingFeedBack(Long ratingId){
        return ratingFeedBackRepo.findById(ratingId)
                .orElseThrow(()->new EntityNotFoundException("Rating and FeedBack not found with id:: "+ratingId));
    }


}
