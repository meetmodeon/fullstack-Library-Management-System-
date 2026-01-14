package com.meet.library.LMS.service;

import com.meet.library.LMS.dto.response.BookResponse;
import com.meet.library.LMS.dto.response.BorrowedResponse;
import com.meet.library.LMS.dto.request.BorrowedRequest;
import com.meet.library.LMS.dto.response.DigitalResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BorrowedBookService {

    BorrowedResponse borrowedBook(BorrowedRequest borrowedDto);
    BorrowedResponse returnedBook(Long userId,Long bookId);
    Page<BorrowedResponse> getAllBorrowedList(Pageable pageable);
    Page<BorrowedResponse> getBorrowedByUserId(Long userId, Pageable pageable);
    BorrowedResponse updateBookReturnIssueDate(Long userId);
    DigitalResponse getAllDigitalResponse(Long userId);
    void getBorrowedByUserIdAndBorrowed(Long userId);

}
