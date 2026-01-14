package com.meet.library.LMS.controller;

import com.meet.library.LMS.dto.request.BookBorrowCheckRequest;
import com.meet.library.LMS.dto.request.BookRequest;
import com.meet.library.LMS.dto.response.BookDetailResponse;
import com.meet.library.LMS.dto.response.BookDetailsDto;
import com.meet.library.LMS.dto.response.BookResponse;
import com.meet.library.LMS.dto.response.RecycleHubResponse;
import com.meet.library.LMS.enums.BookStatus;
import com.meet.library.LMS.enums.FileType;
import com.meet.library.LMS.service.AdminDashboardServices;
import com.meet.library.LMS.service.BookService;
import com.meet.library.LMS.service.ChatService;
import com.meet.library.LMS.validation.OnCreate;
import com.meet.library.LMS.validation.OnUpdate;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Flux;

import java.io.File;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/books")
@Slf4j
@RequiredArgsConstructor
@Tag(name = "Book Management",description = "CRUD operations for books")
@SecurityRequirement(name = "BearerAuth")
public class BookController {

    private final BookService bookService;
    private final ChatService chatService;
    private final AdminDashboardServices adminDashboardServices;
    private final String uploadDir="upload/books/";

    @Operation(summary = "add New Book",description = "return book which add to the db")
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    public ResponseEntity<BookResponse> addBook(@RequestBody @Validated(OnCreate.class) BookRequest dto){
        log.info("The book dto is:: ",dto);
        BookResponse created=bookService.addBook(dto);
        return ResponseEntity
                .created(URI.create("/api/v1/books/"+created.bookId()))
                .body(created);
    }

    @Operation(summary = "Get Book with its id",description = "Return book which request with id")
    @GetMapping("/id/{bookId}")
    public ResponseEntity<BookResponse> getBookById(@PathVariable Long bookId){
        return ResponseEntity.ok(bookService.getBookById(bookId));
    }

    @Operation(summary = "Get Book with its name")
    @GetMapping("/name/{name}")
    public ResponseEntity<BookResponse> getBookByName(@PathVariable String name){
        return ResponseEntity.ok(bookService.getBookByName(name));
    }

    @Operation(summary = "update book with its id")
    @PutMapping("/updateById/{bookId}")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    public ResponseEntity<BookResponse> updateBookById(@PathVariable Long bookId,
                                                       @Validated(OnUpdate.class) @RequestBody BookRequest dto){
        return ResponseEntity.ok(bookService.updateBookById(bookId,dto));
    }

    @Operation(summary = "Delete book With its id")
    @DeleteMapping("/deleteById/{bookId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String,String>> deleteBookById(@PathVariable Long bookId){
        bookService.deleteBookById(bookId);
        Map<String,String> msg=new HashMap<>();
        msg.put("msg","book is successfully deleted with id:: "+bookId);
        return ResponseEntity.status(HttpStatus.OK).body(msg);
    }
    @GetMapping
    @Operation(summary = "Get All Book")
    public ResponseEntity<Page<BookResponse>> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ){
        Pageable pageable= PageRequest.of(
                page,
                size,
                direction.equalsIgnoreCase("asc")? Sort.by(sortBy).ascending()
                        :Sort.by(sortBy).descending()
        );

        return ResponseEntity.ok(bookService.getAllBooks(pageable));
    }

    @GetMapping("/similar")
    @Operation(summary = "Get Book by Author Name")
    public ResponseEntity<Page<BookResponse>> getSimilarBooks(@RequestParam("bookId") Long bookId,
                                                             @RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "10") int size,
                                                             @RequestParam(defaultValue = "averageRating") String sortBy,
                                                             @RequestParam(defaultValue = "desc") String direction
                                                        ){
        Pageable pageable=PageRequest.of(
                page,
                size,
                direction.equalsIgnoreCase("desc")?Sort.by(sortBy).descending():Sort.by(sortBy).ascending()
        );
        return ResponseEntity.ok(bookService.getSimilarBookBasedOnSubCategoryOrAuthor(bookId,pageable));
    }

    @GetMapping("/search")
    @Operation(summary = "Search the book its name")
    public ResponseEntity<Page<BookResponse>> searchBook(@RequestParam("word") String word,
                                                         @RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "10") int size,
                                                         @RequestParam(defaultValue = "name") String sortBy,
                                                         @RequestParam(defaultValue = "asc") String direction){
        Pageable pageable=PageRequest.of(
                page,
                size,
                direction.equalsIgnoreCase("asc")?Sort.by(sortBy).ascending():Sort.by(sortBy).descending()
        );

        return ResponseEntity.ok(bookService.searchBook(word,pageable));
    }

    @PutMapping("/{bookId}")
    @Operation(summary = "update book status")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    public ResponseEntity<BookResponse> updateBookStatus(@PathVariable Long bookId, @RequestBody BookStatus status){
        return ResponseEntity.status(HttpStatus.OK).body(bookService.updateBookStatus(bookId,status));
    }

    @GetMapping("/isBookBorrowed")
    @Operation(summary = "Check book is Borrowed or not")
    public ResponseEntity<Map<String,Boolean>> isBookBorrowed(@RequestBody @Valid BookBorrowCheckRequest bookBorrowCheckRequest){
        Map<String,Boolean> msg=new HashMap<>();

        if(bookBorrowCheckRequest == null){
            msg.put("isBookBorrowed",false);
            return ResponseEntity.badRequest().body(msg);
        }
        boolean isBookBorrowed=bookService.isBookBorrowed(bookBorrowCheckRequest.bookIds());
        msg.put("isBookBorrowed",isBookBorrowed);
        return ResponseEntity.ok(msg);
    }
    @PostMapping(
            value = "/uploadImage",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    public ResponseEntity<Map<String,String>> uploadBookImage(
            @RequestParam Long bookId,
            @RequestParam FileType type,
            @RequestParam MultipartFile file
            ){
        Map<String,String> msg=new HashMap<>();
        log.info("the data are {}",bookId,type);
       if(FileType.BOOK_IMAGE.equals(type)){
           bookService.uploadBookImage(bookId,file);
           msg.put("msg","Book image is uploaded");
       }
       if(FileType.BOOK_PDF.equals(type)){
          bookService.uploadBookPdf(bookId,file);
          msg.put("msg","Book pdf is uploaded");
       }
        return ResponseEntity.ok().body(msg);
    }

    @GetMapping(
            value = "/download",
            produces = MediaType.APPLICATION_OCTET_STREAM_VALUE
    )
    public ResponseEntity<Resource> downloadBookFile(
            @RequestParam Long bookId,
            @RequestParam FileType type
    ) {
        try {
            BookResponse bookResponse = bookService.getBookById(bookId);
            String filePathStr;
            Path filePath=null;
            if (FileType.BOOK_IMAGE.equals(type)) {
                filePathStr = bookResponse.bookImagePath();
                if (filePathStr == null || filePathStr.isEmpty())
                    throw new EntityNotFoundException("Upload book image");
                filePath= Paths.get(uploadDir+"/images/").resolve(filePathStr).normalize();
            } else if (FileType.BOOK_PDF.equals(type)) {
                filePathStr = bookResponse.bookPdfPath();
                if (filePathStr == null || filePathStr.isEmpty())
                    throw new EntityNotFoundException("Upload book PDF");
                filePath= Paths.get(uploadDir+"/image/").resolve(filePathStr).normalize();
            } else {
                throw new IllegalArgumentException("Invalid FileType");
            }
            if (!Files.exists(filePath)) {
                throw new EntityNotFoundException("File not found: " + filePathStr);
            }

            Resource resource = new UrlResource(filePath.toUri());
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filePath.getFileName() + "\"")
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/topRating")
    public ResponseEntity<Page<BookResponse>> getTopRatingBook(
            @RequestParam(required = false,defaultValue = "0") int page,
            @RequestParam(required = false,defaultValue = "10") int size
    ){
        Pageable pageable=PageRequest.of(page,size);
        return ResponseEntity.ok(adminDashboardServices.getTopRatedBook(pageable));
    }

    @GetMapping("/details/{bookId}")
    public ResponseEntity<BookDetailResponse> getBookDetails(@PathVariable Long bookId){
        return ResponseEntity.ok(bookService.getBookDetails(bookId));
    }
    @GetMapping("/recommendation")
    public ResponseEntity<Page<BookResponse>> recommendationBook(
            @RequestParam String email,
            @RequestParam(required = false,defaultValue = "0") int page,
            @RequestParam(required = false,defaultValue = "4") int size
    ){
        Pageable pageable=PageRequest.of(page,size);
        return ResponseEntity.ok(adminDashboardServices.recommendBooksForUser(email,pageable));
    }
    @GetMapping("/trending")
    public ResponseEntity<Page<BookResponse>> trendingBook(
            @RequestParam(required = false,defaultValue = "0")int page,
            @RequestParam(required = false,defaultValue = "10") int size
    ){
        Pageable pageable=PageRequest.of(page,size);
        return ResponseEntity.ok(adminDashboardServices.getTrendingBooksLast30Days(pageable));
    }
    @GetMapping("/popular")
    public ResponseEntity<Page<BookResponse>> mostPopularBook(
            @RequestParam(required = false,defaultValue = "0") int page,
            @RequestParam(required = false,defaultValue = "10") int size
    ){
        Pageable pageable=PageRequest.of(
                page,
                size
        );
            return ResponseEntity.ok(adminDashboardServices.getMostPopularBooks(pageable));

    }

    @GetMapping("/getBySubCategoryId")
    public ResponseEntity<Page<BookResponse>> allBookBySubCategoryId(
            @RequestParam Long subCategoryId,
            @RequestParam(required = false,defaultValue = "0") int page,
            @RequestParam(required = false,defaultValue = "10") int size
    ){
        Pageable pageable=PageRequest
                .of(page,size);
        return ResponseEntity.ok(adminDashboardServices.getBookBySubCategoryId(subCategoryId,pageable));
    }

    @GetMapping("/getRecycle")
    public ResponseEntity<RecycleHubResponse> getAllRecycleHubDetails(){
        return ResponseEntity.ok(adminDashboardServices.getRecycleHubDetails());
    }

    @GetMapping(
            value = "/book-chat",
            produces = "text/event-stream"
    )
    public Flux<ServerSentEvent<String>> chatStream(@RequestParam String prompt){
        return chatService.askBookAi(prompt)
                .map(msg->ServerSentEvent.builder(msg).build());

    }

}
