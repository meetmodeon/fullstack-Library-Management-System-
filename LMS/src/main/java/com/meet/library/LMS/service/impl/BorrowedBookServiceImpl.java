package com.meet.library.LMS.service.impl;

import com.meet.library.LMS.dto.request.AnnouncementRequest;
import com.meet.library.LMS.dto.response.BookResponse;
import com.meet.library.LMS.dto.response.BorrowedResponse;
import com.meet.library.LMS.dto.response.DigitalResponse;
import com.meet.library.LMS.entity.Book;
import com.meet.library.LMS.entity.Borrowed;
import com.meet.library.LMS.entity.SubCategory;
import com.meet.library.LMS.entity.User;
import com.meet.library.LMS.enums.AnnouncementType;
import com.meet.library.LMS.enums.BookStatus;
import com.meet.library.LMS.enums.BorrowedStatus;
import com.meet.library.LMS.exception.BadRequestException;
import com.meet.library.LMS.exception.BookNotFoundException;
import com.meet.library.LMS.exception.OverDueFineException;
import com.meet.library.LMS.exception.UserNotFoundException;
import com.meet.library.LMS.repository.BookRepo;
import com.meet.library.LMS.repository.BorrowedRepo;
import com.meet.library.LMS.repository.UserRepo;
import com.meet.library.LMS.dto.request.BorrowedRequest;
import com.meet.library.LMS.service.BookService;
import com.meet.library.LMS.service.BorrowedBookService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;

import java.time.LocalDateTime;
import java.time.Period;
import java.util.*;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Slf4j
public class BorrowedBookServiceImpl implements BorrowedBookService {
    private final BorrowedRepo borrowedRepo;
    private final BookRepo bookRepo;
    private final BookService bookService;
    private final ModelMapper modelMapper;
    private final UserRepo userRepo;
    private final AnnouncementServiceImpl announcementService;


    @Override
    @Transactional
    public BorrowedResponse borrowedBook(BorrowedRequest borrowedDto) {
        User user=userRepo.findByUserId(borrowedDto.userId())
                .orElseThrow(()->new UserNotFoundException("User not found"));
        Book book=bookRepo.findByBookId(borrowedDto.bookId()).orElseThrow(()->new BookNotFoundException("Book not found with id: "+borrowedDto.bookId()));

        boolean hasActiveBorrow=borrowedRepo.existsByUserUserIdAndStatus(
                user.getUserId(),
                BorrowedStatus.BORROWED
        );
        if(hasActiveBorrow){
            throw new BadRequestException("Please return the book you borrowed before borrowing another.");
        }
        Borrowed borrowed=new Borrowed();
        borrowed.setUser(user);
        borrowed.setBook(book);
        borrowed.setBorrowedDate(LocalDateTime.now());
        borrowed.setReturnedDate(LocalDateTime.now().plusDays(7));
        borrowed.setStatus(BorrowedStatus.BORROWED);
        Borrowed save=borrowedRepo.save(borrowed);
        book.setBookStatus(BookStatus.BORROWED);
        bookRepo.save(book);
        BorrowedResponse returnDto=new BorrowedResponse(save);
         return returnDto;
    }



    @Override
    @Transactional
    public BorrowedResponse returnedBook(Long userId,Long bookId) {
        Borrowed borrowed=borrowedRepo.findByUserUserIdAndBookBookIdAndStatus(
                userId,
                bookId,
                BorrowedStatus.BORROWED
        ).orElseThrow(()->new EntityNotFoundException("Unable to return book."));

       LocalDateTime today=LocalDateTime.now();
       LocalDateTime returnedDate=borrowed.getReturnedDate();

       if(returnedDate.isBefore(today))
       {
           Duration duration=Duration.between(today,returnedDate);
           log.info("OverDue of {} day(s): ",duration.toDays()+"hours: "+duration.toHours()%24+"Minutes: "+duration.toMinutes()%60);
           throw new OverDueFineException("The returning time exceeded from due date.You are "+duration.toDays()+"days,hours "+duration.toHours()%24+"Minutes: "+duration.toHours()%60);
       }
        borrowed.setReturnedDate(today);
        borrowed.setStatus(BorrowedStatus.RETURNED);
        Book book=borrowed.getBook();
        book.setBookStatus(BookStatus.AVAILABLE);
        bookRepo.save(book);
        BorrowedResponse returnBook=new BorrowedResponse(borrowedRepo.save(borrowed));
       return returnBook;
    }

    @Override
    public Page<BorrowedResponse> getAllBorrowedList(Pageable pageable) {
        return borrowedRepo.findAll(pageable)
                .map(BorrowedResponse::new);
    }

    @Override
    public Page<BorrowedResponse> getBorrowedByUserId(Long userId, Pageable pageable) {
     return borrowedRepo.findByUserUserId(userId,pageable)
             .map(BorrowedResponse::new);
    }

    @Override
    @Transactional
    public BorrowedResponse updateBookReturnIssueDate(Long borrowedId) {
        Borrowed borrowed=borrowedRepo.findByBorrowedId(borrowedId)
                .orElseThrow(()->new RuntimeException("Borrowed Id not found"));
        borrowed.setReturnedDate(borrowed.getReturnedDate().plusDays(7));
        borrowed.setStatus(BorrowedStatus.BORROWED);
        return new BorrowedResponse(borrowedRepo.save(borrowed));
    }

    @Override
    public DigitalResponse getAllDigitalResponse(Long userId) {
        Long totalBook=bookRepo.count();
        Long totalBorrowed=borrowedRepo.countByUserUserId(userId);
        List<Long> listOfBookId=borrowedRepo.getBookId(userId);
        DigitalResponse response=new DigitalResponse();
        response.setTotalBook(totalBook);
        response.setTotalBorrowed(totalBorrowed);
        response.setListOfBookId(listOfBookId);
        return response;
    }

    @Override
    public void getBorrowedByUserIdAndBorrowed(Long userId) {
        Optional<Borrowed> borrowed= borrowedRepo.findByUserUserIdAndStatus(
                userId,
                BorrowedStatus.BORROWED
        );
        if(borrowed.isPresent()){
            String dueTime=BorrowedResponse.getRemainingTime(borrowed.get().getReturnedDate());
            AnnouncementRequest request=new AnnouncementRequest("Book Due","You Book is Borrowed time remaining is: "+dueTime, AnnouncementType.BOOK_DUE);
            announcementService.createAnnouncement(request);
        }

    }


}
