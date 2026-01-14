package com.meet.library.LMS.repository;

import com.meet.library.LMS.entity.RatingFeedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface RatingFeedBackRepo extends JpaRepository<RatingFeedback,Long> {


    List<RatingFeedback> findByBookBookId(Long bookId);
    Page<RatingFeedback> findByBookBookId(Long bookId, Pageable pageable);

    Optional<RatingFeedback> findByUserUserIdAndBookBookId(Long userId, Long bookId);

    Optional<RatingFeedback> findByIdAndUserUserIdAndBookBookId(Long ratingId, Long userId, Long bookId);


    @Query(
            value = """
                    SELECT
                    SUM(CASE WHEN rating>=1.0 AND rating < 1.5 THEN 1 ELSE 0 END) AS `1`,
                    SUM(CASE WHEN rating>=1.5 AND rating < 2.5 THEN 1 ELSE 0 END) AS `2`,
                    SUM(CASE WHEN rating>=2.5 AND rating < 3.5 THEN 1 ELSE 0 END) AS `3`,
                    SUM(CASE WHEN rating>=3.5 AND rating < 4.5 THEN 1 ELSE 0 END) AS `4`,
                    SUM(CASE WHEN rating>=4.5 AND rating < 5.0 THEN 1 ELSE 0 END) AS `5`
                    FROM rating_feedback
                    WHERE book_id= :bookId
                    """,
            nativeQuery = true
    )
    Map<String,Object> countRatingRanges(
            @Param("bookId") Long bookId
    );

    Long countByBookBookId(Long bookId);

    @Query(
            """
                    SELECT r FROM RatingFeedback r
                    WHERE r.book.bookId= :bookId
                    AND(:cursor IS NULL OR r.id > :cursor)
                    ORDER BY r.id ASC
                    """
    )
    List<RatingFeedback> findRatingByBookId(@Param("bookId") Long bookId,@Param("cursor") Long cursor,Pageable pageable);
}
