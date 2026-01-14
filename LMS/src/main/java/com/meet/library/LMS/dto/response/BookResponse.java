package com.meet.library.LMS.dto.response;

import com.meet.library.LMS.entity.Book;
import com.meet.library.LMS.entity.SubCategory;
import com.meet.library.LMS.enums.BookStatus;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;


public record BookResponse(
    Long bookId,
    String name,
    String isbn,
    Set<String> author,
    String publication,
    Long subCategoryId,
    BigDecimal averageRating,
    String detail,
    BookStatus bookStatus,
    String bookImagePath,
    String bookPdfPath
    ){
    public BookResponse(Book book){
        this(book.getBookId(),book.getName(),book.getIsbn(),book.getAuthor(),book.getPublication(),book.getSubCategories().getSubCategoryId(),book.getAverageRating(),book.getDetail(),book.getBookStatus(),book.getBookImagePath(),book.getBookPdfPath());
    }
}
