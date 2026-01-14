package com.meet.library.LMS.service;

import com.meet.library.LMS.dto.request.BookRequest;
import com.meet.library.LMS.dto.response.BookDetailResponse;
import com.meet.library.LMS.dto.response.BookResponse;
import com.meet.library.LMS.enums.BookStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

public interface BookService {
    BookResponse addBook(BookRequest bookResponse);
    BookResponse getBookById(Long bookId);
    BookResponse getBookByName(String bookName);
    BookResponse updateBookById(Long bookId, BookRequest dto);
    void deleteBookById(Long bookId);
    Page<BookResponse> getSimilarBookBasedOnSubCategoryOrAuthor(Long bookId,Pageable pageable);
   Page<BookResponse> getAllBooks(Pageable pageable);
    Page<BookResponse> getByBookAuthor(String author, Pageable pageable);
    Page<BookResponse> searchBook(String word, Pageable pageable);

    BookResponse updateBookStatus(Long bookId, BookStatus status);
    BookDetailResponse getBookDetails(Long bookId);

    Boolean isBookBorrowed(Set<Long> bookId);
    void uploadBookImage(Long bookId,MultipartFile file);
    void uploadBookPdf(Long bookId,MultipartFile file);
}
