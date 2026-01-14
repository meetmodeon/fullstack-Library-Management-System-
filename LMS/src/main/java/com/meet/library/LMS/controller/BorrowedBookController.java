package com.meet.library.LMS.controller;

import com.meet.library.LMS.dto.response.BookDetailResponse;
import com.meet.library.LMS.dto.response.BorrowedResponse;
import com.meet.library.LMS.dto.request.BorrowedRequest;
import com.meet.library.LMS.dto.response.DigitalResponse;
import com.meet.library.LMS.service.BorrowedBookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/bookBorrowed")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Borrowed Book Management",description = "Book borrowed operation for book")
@SecurityRequirement(name = "BearerAuth")
public class BorrowedBookController {

    private final BorrowedBookService borrowedBookService;

    @PostMapping
    @Operation(summary = "BorrowedBook operation",description = "Return book borrowed or not")
    public ResponseEntity<BorrowedResponse> borrowedBook(@RequestBody BorrowedRequest dto){
        BorrowedResponse borrowedResponse =borrowedBookService.borrowedBook(dto);
        return ResponseEntity
                .created(URI.create("/api/v1/bookBorrowed/"+ borrowedResponse.borrowedId()))
                .body(borrowedResponse);
    }

    @PostMapping("/returnBook")
    @Operation(summary = "Return Book",description = "This is used to return book")
    public ResponseEntity<BorrowedResponse> returnedBook(@RequestBody BorrowedRequest request){
        return ResponseEntity
                .ok(borrowedBookService.returnedBook(request.userId(),request.bookId()));
    }
    @GetMapping
    public ResponseEntity<Page<BorrowedResponse>> getAllBorrowedList(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "borrowedId") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ){
        Pageable pageable= PageRequest.of(
                page,
                size,
                direction.equalsIgnoreCase("asc")? Sort.by(sortBy).ascending():Sort.by(sortBy).descending()
        );
        
        return ResponseEntity.ok(borrowedBookService.getAllBorrowedList(pageable));
        
    }
    @GetMapping("/getByUserId")
    public ResponseEntity<Page<BorrowedResponse>> getBorrowedByUserId(
            @RequestParam Long userId,
            @RequestParam(required = false,defaultValue = "0") int page,
            @RequestParam(required = false,defaultValue = "10") int size,
            @RequestParam(required = false,defaultValue = "borrowedDate") String sortBy,
            @RequestParam(required = false,defaultValue = "desc") String direction
    ){
        Pageable pageable=PageRequest.of(
                page,
                size,
                direction.equalsIgnoreCase("asc")?Sort.by(sortBy).ascending():Sort.by(sortBy).descending()
        );
        return ResponseEntity.ok(borrowedBookService.getBorrowedByUserId(userId,pageable));
    }

    @PutMapping("/{borrowedId}")
    public ResponseEntity<BorrowedResponse> updateBookReturnIssueDate(@PathVariable Long borrowedId){
        return ResponseEntity.ok(borrowedBookService.updateBookReturnIssueDate(borrowedId));
    }

    @GetMapping("/digitalPage/{userId}")
    public ResponseEntity<DigitalResponse> getDigitalPage(@PathVariable Long userId){
        return ResponseEntity.ok(borrowedBookService.getAllDigitalResponse(userId));
    }

}
