package com.meet.library.LMS.repository;


import com.meet.library.LMS.dto.response.BookDetailResponse;
import com.meet.library.LMS.dto.response.BookDetailsDto;
import com.meet.library.LMS.entity.Book;
import com.meet.library.LMS.entity.SubCategory;
import com.meet.library.LMS.enums.BookStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface BookRepo extends JpaRepository<Book,Long> {
    Optional<Book> findByName(String bookName);
    @Query(
            """
                    SELECT DISTINCT b FROM Book b JOIN b.author a WHERE LOWER(a) LIKE LOWER(CONCAT('%', :name,'%'))
                    """
    )
    Page<Book> findByAuthorNameLike(String name,Pageable pageable);


    @Query("""
       SELECT DISTINCT b FROM Book b
       LEFT JOIN b.subCategories sc
       WHERE LOWER(b.name) LIKE LOWER(CONCAT('%', :word, '%'))
          OR LOWER(b.isbn) LIKE LOWER(CONCAT('%', :word, '%'))
          OR LOWER(b.publication) LIKE LOWER(CONCAT('%', :word, '%'))
          OR LOWER(sc.name) LIKE LOWER(CONCAT('%', :word, '%'))
          OR EXISTS(
          SELECT a FROM b.author a
          WHERE LOWER(a) LIKE LOWER(CONCAT('%', :word,'%'))
          )
       """)
    Page<Book> searchByKeyword(String word, Pageable pageable);

    @Query("""
            SELECT DISTINCT b 
            FROM Book b
            LEFT JOIN FETCH b.subCategories sc
            LEFT JOIN FETCH b.author a
            WHERE
            (sc.subCategoryId= :subCategoryId  OR a IN :authors)
            AND b.bookId <> :bookId
            """)
    Page<Book> findSimilarBooksExcludeSelf(
            @Param("subCategoryId")Long subCategoryId,
            @Param("authors") Collection<String> authors,
            @Param("bookId") Long bookId,
            Pageable pageable
            );
    boolean existsByBookStatus(BookStatus status);

    Optional<Book> findByBookId(Long borrowedId);


    @Query("""
            SELECT b
            FROM Book b
            WHERE b.subCategories.subCategoryId = :subCategoryId
            AND b.bookId NOT IN :borrowedBookIds
            """)
    Page<Book> recommendBooks(
            Long subCategoryId,
            List<Long> borrowedBookIds,
            Pageable pageable
    );

    @Query("""
            SELECT b
            FROM Book b
            ORDER BY b.averageRating DESC
            """)
    Page<Book> findTopRatedBooks(Pageable pageable);

    @Query("""
            SELECT b 
            FROM Book b
            JOIN b.borrowedList br
            WHERE br.borrowedDate>= :date
            GROUP BY b
            ORDER BY COUNT(br) DESC
            """
    )
    Page<Book> findTrendingBooksLast30Days(
           @Param("date") LocalDateTime date,
            Pageable pageable
    );

    @Query("""
            SELECT b
            FROM Book b 
            LEFT JOIN b.borrowedList br
            GROUP BY b
            ORDER BY (COUNT(br) * 2 + b.averageRating * 10) DESC
            """)
    Page<Book> findMostPopularBooks(Pageable pageable);

    @Query(
            """
                    SELECT b
                    FROM Book b
                    LEFT JOIN b.borrowedList br
                    WHERE b.subCategories.subCategoryId = :subCategoryId
                    GROUP BY b
                    ORDER BY (COUNT(br) * 2 + b.averageRating *10) DESC
                    """
    )
    Page<Book> findBookBySubCategoryId(
            @Param("subCategoryId") Long subCategoryId,
            Pageable pageable
    );

    @Query(
            """
                    SELECT new com.meet.library.LMS.dto.response.BookDetailResponse(
                    b.bookId,
                    b.name,
                    b.detail,
                    b.averageRating,
                    COUNT(r.id),
                    b.bookStatus,
                    COUNT(br.borrowedId),
                    sc.name
                    )
                    FROM Book b 
                    LEFT JOIN b.ratingFeedbacks r
                    LEFT JOIN b.borrowedList br
                    LEFT JOIN b.subCategories sc
                    WHERE b.bookId= :bookId
                  
                    """
    )
    Optional<BookDetailResponse> getBookDetails(@Param("bookId") Long bookId);
    @Query(
            """
                    SELECT new com.meet.library.LMS.dto.response.BookDetailResponse(
                    b.bookId,
                    b.name,
                    b.detail,
                    b.averageRating,
                    COUNT(r.id),
                    b.bookStatus,
                    COUNT(br.borrowedId),
                    sc.name
                    )
                    FROM Book b 
                    LEFT JOIN b.ratingFeedbacks r
                    LEFT JOIN b.borrowedList br
                    LEFT JOIN b.subCategories sc
                    """
    )
    Page<BookDetailsDto> getAllBookDetails(Pageable pageable);

}
