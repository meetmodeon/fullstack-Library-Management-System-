package com.meet.library.LMS.repository;

import com.meet.library.LMS.entity.Book;
import com.meet.library.LMS.entity.Borrowed;
import com.meet.library.LMS.entity.User;
import com.meet.library.LMS.enums.BorrowedStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BorrowedRepo extends JpaRepository<Borrowed,Long> {
    @Query("""
            SELECT b FROM Borrowed b
            WHERE b.user.userId= :userId
             ORDER BY b.borrowedDate DESC
            """)
    Page<Borrowed> findByUserUserId(@Param("userId") Long userId, Pageable pageable);

    Optional<Borrowed> findByBorrowedId(Long borrowedId);

    List<Borrowed> findByBookAndStatus(Book book,BorrowedStatus status);

    boolean existsByUserUserIdAndStatus(Long userId, BorrowedStatus borrowed);

    Optional<Borrowed> findByUserUserIdAndStatus(Long userId, BorrowedStatus borrowed);

    Optional<Borrowed> findByUserUserIdAndBookBookIdAndStatus(Long userId, Long bookId, BorrowedStatus borrowed);

//    @Query("""
//    SELECT b
//    FROM Borrowed b
//    WHERE b.user.userId = :userId
//      AND b.status IN :statuses
//""")
//    List<Borrowed> findByUserAndStatuses(
//            @Param("userId") Long userId,
//            @Param("statuses") List<BorrowedStatus> statuses
//    );
    @Query("""
            SELECT b.book.subCategories.subCategoryId,
            COUNT(b)
            FROM Borrowed b
            WHERE b.user.userId= :userId
            AND b.status IN (:statuses)
            GROUP BY b.book.subCategories.subCategoryId
            ORDER BY COUNT(b) DESC
            """)

    List<Object[]> findMostBorrowedSubCategory(
            Long userId,
            List<BorrowedStatus> statuses
    );
    
    @Query("""
            SELECT DISTINCT b.book.bookId
            FROM Borrowed b
            WHERE b.user.userId= :userId 
            """)
    List<Long> findBorrowedBookIds(Long userId);

    boolean existsByUserUserId(Long userId);

    boolean existsByUserEmail(String email);

    @Query(
            """
                    SELECT COUNT(b.borrowedId) FROM Borrowed b
                    WHERE b.user.userId= :userId
                    """
    )
    Long countByUserUserId(@Param("userId") Long userId);

    @Query(
            """
                    SELECT DISTINCT(book.bookId) FROM Borrowed b
                    JOIN b.book book
                    WHERE b.user.userId = :userId
                    """
    )
    List<Long> getBookId(@Param("userId") Long userId);

    @Query(
            """
                    SELECT COUNT(DISTINCT(b.user.userId)) FROM Borrowed b
                    WHERE b.borrowedDate >= :sixMonthAgo
                    """
    )
    Long studentCount(@Param("sixMonthAgo")LocalDateTime sixMonthAgo);
}
