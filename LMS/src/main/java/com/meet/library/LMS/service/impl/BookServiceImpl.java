package com.meet.library.LMS.service.impl;

import com.meet.library.LMS.dto.request.AnnouncementRequest;
import com.meet.library.LMS.dto.response.BookDetailResponse;
import com.meet.library.LMS.dto.response.BookDetailsDto;
import com.meet.library.LMS.dto.response.BookResponse;
import com.meet.library.LMS.dto.request.BookRequest;
import com.meet.library.LMS.entity.Book;
import com.meet.library.LMS.entity.SubCategory;
import com.meet.library.LMS.enums.AnnouncementType;
import com.meet.library.LMS.enums.BookStatus;
import com.meet.library.LMS.enums.FileType;
import com.meet.library.LMS.exception.BadRequestException;
import com.meet.library.LMS.exception.BookNotFoundException;
import com.meet.library.LMS.exception.CategoryNotFoundException;
import com.meet.library.LMS.repository.BookRepo;
import com.meet.library.LMS.repository.SubCategoryRepo;
import com.meet.library.LMS.service.AnnouncementService;
import com.meet.library.LMS.service.BookService;
import com.meet.library.LMS.service.RatingFeedBackService;
import com.meet.library.LMS.storage.FileStorageService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookServiceImpl implements BookService {
    private final BookRepo bookRepo;
    private final ModelMapper modelMapper;
    private final SubCategoryRepo subCategoryRepo;
    private final RatingFeedBackService ratingFeedBackService;
    private final AnnouncementService announcementService;
    private final FileStorageService fileStorageService;
    @Override
    @Transactional
    public BookResponse addBook(BookRequest bookDto) {
        if (bookDto == null) throw new IllegalArgumentException("BookResponse cannot be null");
        if (bookDto.subCategoriesId() == null) {
            throw new CategoryNotFoundException("SubCategory IDs cannot be null or empty");
        }
        Book book = Book.builder()
                .name(bookDto.name())
                .author(bookDto.author())
                .isbn(bookDto.isbn())
                .averageRating(BigDecimal.valueOf(0L))
                .detail(bookDto.detail())
                .publication(bookDto.publication())
                .bookStatus(BookStatus.AVAILABLE)
                .build();

        SubCategory subCategories=getSubCategoryById(bookDto.subCategoriesId());

        if( bookDto.bookImageFile()!=null && !bookDto.bookImageFile().isEmpty()){
            book.setBookImagePath(fileStorageService.upload(bookDto.bookImageFile(), FileType.BOOK_IMAGE,null).fileName());
        }
        if ( bookDto.bookPdfFile()!=null && !bookDto.bookPdfFile().isEmpty() )
            book.setBookPdfPath(fileStorageService.upload(bookDto.bookPdfFile(),FileType.BOOK_PDF,null).fileName());

        book.setSubCategories(subCategories);
        Book savedBook = bookRepo.save(book);
        subCategories.addBook(savedBook);

        String categoryName=subCategories.getCategory().getName();
        AnnouncementRequest request=new AnnouncementRequest("Add New Book","Added new "+categoryName+" category book.Please Check out",AnnouncementType.NEW_BOOK);
        announcementService.createAnnouncement(request);
        BookResponse savedDto = new BookResponse(savedBook);

        return savedDto;
    }

    private SubCategory getSubCategoryById(Long subCategoriesId) {
        return subCategoryRepo.findBySubCategoryId(subCategoriesId)
                .orElseThrow(()->new CategoryNotFoundException("SubCategory not found with give id"));
    }


    @Override
    public BookResponse getBookById(Long bookId) {
        Book book=findBookByBookId(bookId);
        BookResponse bookResponse =new BookResponse(book);
        return bookResponse;
    }

    @Override
    public BookResponse getBookByName(String bookName) {
        Book book=bookRepo.findByName(bookName).orElseThrow(()->new BookNotFoundException("Book not found with name"));
        BookResponse bookResponse =new BookResponse(book);
        return bookResponse;
    }

    @Override
    @Transactional
    public BookResponse updateBookById(Long bookId, BookRequest bookResponse) {
        Book book=findBookByBookId(bookId);
        if(bookResponse.subCategoriesId()!=null) {
            SubCategory subCategory = subCategoryRepo.findBySubCategoryId(bookResponse.subCategoriesId())
                    .orElseThrow(()->new CategoryNotFoundException("SubCategory not found with give id"));

            if(!book.getSubCategories().equals(subCategory)){
                book.setSubCategories(subCategory);
                subCategory.addBook(book);
            }
        }
        if(!book.getAuthor().containsAll(bookResponse.author())){
            book.setAuthor(bookResponse.author());
        }
        if( bookResponse.bookImageFile()!=null && !bookResponse.bookImageFile().isEmpty()){
            book.setBookImagePath(fileStorageService.upload(bookResponse.bookImageFile(),FileType.BOOK_IMAGE,book.getBookImagePath()).fileName());

        }
        if(bookResponse.bookPdfFile()!=null && !bookResponse.bookPdfFile().isEmpty()){
            book.setBookImagePath(fileStorageService.upload(bookResponse.bookPdfFile(),FileType.BOOK_PDF,book.getBookPdfPath()).fileName());
        }
        book.setName(
                bookResponse.name()!=null? bookResponse.name() : book.getName()
        );
        book.setIsbn(
                bookResponse.isbn()!=null
                ?bookResponse.isbn()
                        :book.getIsbn()
        );
        book.setPublication(
                bookResponse.isbn()!=null
                ? bookResponse.publication()
                        :book.getPublication()
        );


        BookResponse bookResponse1 =new BookResponse(book);

        return bookResponse1;
    }

    private Book findBookByBookId(Long bookId) {
        return bookRepo.findById(bookId)
                .orElseThrow(()->new BookNotFoundException("Book not found with id: "+bookId));
    }

    @Override
    @Transactional
    @Async("taskExecutor")
    public void deleteBookById(Long bookId) {
        Book book=bookRepo.findById(bookId)
                .orElseThrow(()->new BookNotFoundException("Book not found with id: "+bookId));
        book.getSubCategories().removeBook(book);
        bookRepo.deleteById(book.getBookId());
    }

    @Override
    public Page<BookResponse> getSimilarBookBasedOnSubCategoryOrAuthor(Long bookId,Pageable pageable) {
        Book book=bookRepo.findById(bookId).orElseThrow(()-> new BookNotFoundException("Book not found with id: "+bookId));
        return bookRepo.findSimilarBooksExcludeSelf(
                book.getSubCategories().getSubCategoryId(),
                book.getAuthor(),
                book.getBookId(),
                pageable).map(BookResponse::new);
    }

    @Override
    public Page<BookResponse> getAllBooks(Pageable pageable) {
        Page<Book> allBooks=bookRepo.findAll(pageable);
        if(allBooks.isEmpty()){
           return Page.empty(pageable);
        }
        return allBooks.map(BookResponse::new);
    }

    @Override
    public Page<BookResponse> getByBookAuthor(String author, Pageable pageable) {
        Page<Book> allBooks=bookRepo.findByAuthorNameLike(author,pageable);
        if(allBooks.isEmpty()){
            return Page.empty(pageable);
        }
        return getAllBooksDto(allBooks);
    }

    @Override
    public Page<BookResponse> searchBook(String word, Pageable pageable) {
        Page<Book> allBooks=bookRepo.searchByKeyword(word,pageable);
        if(allBooks.isEmpty()){
            return Page.empty(pageable);
        }
        return getAllBooksDto(allBooks);
    }

    @Override
    @Transactional
    public BookResponse updateBookStatus(Long bookId, BookStatus status) {
        Book book=findBookByBookId(bookId);
        book.setBookStatus(status);
        BookResponse bookResponse =new BookResponse(book);
        return bookResponse;
    }

    @Override
    public BookDetailResponse getBookDetails(Long bookId) {
        Book book=bookRepo.findById(bookId).orElseThrow(()->new BookNotFoundException("Book not found with id:: "+bookId));
        BookDetailResponse response= bookRepo.getBookDetails(bookId)
                .orElseThrow(()->new BookNotFoundException("Book not found with this is:: "+bookId));
        List<String> authors=book.getAuthor().stream().toList();
        response.setAuthors(
                authors !=null?String.join(",",authors):" "
        );

        return response;
    }

    @Override
    public Boolean isBookBorrowed(Set<Long> bookId) {
        List<Book> bookSet=bookId.stream().map(id->{
            Book book=bookRepo.findById(id).orElseThrow(()->new BookNotFoundException("Book not found"));
            return book;
        }).collect(Collectors.toList());

        for(Book b:bookSet){
            if(BookStatus.BORROWED.equals(b.getBookStatus())|| BookStatus.LOST.equals(b.getBookStatus())){
                return true;
            }
        }

        return false;
    }

    private Page<BookResponse> getAllBooksDto(Page<Book> allBooks){
        return allBooks.map(book->{
            BookResponse dto=new BookResponse(book);
            return dto;
        });
    }
    @Override
    @Transactional
    public void uploadBookImage(Long bookId,MultipartFile file){
        Book book=bookRepo.findByBookId(bookId)
                .orElseThrow(()->new EntityNotFoundException("Book not found with id:: "+bookId));
        String imagePath=fileStorageService.upload(file,FileType.BOOK_IMAGE,book.getBookImagePath()).fileName();
        if(imagePath ==null || imagePath.isEmpty())
            throw new BadRequestException("Failed to upload image");
        book.setBookImagePath(imagePath);
        bookRepo.save(book);
    }

    @Override
    @Transactional
    public void uploadBookPdf(Long bookId, MultipartFile file) {
        Book book=bookRepo.findByBookId(bookId)
                .orElseThrow(()->new EntityNotFoundException("Book not found with id:: "+bookId));
        String pdfPath=fileStorageService.upload(file,FileType.BOOK_PDF,book.getBookPdfPath()).fileName();
        if(pdfPath == null || pdfPath.isEmpty())
            throw new RuntimeException("Failed to upload pdf");
        book.setBookPdfPath(pdfPath);
        bookRepo.save(book);
    }


}
