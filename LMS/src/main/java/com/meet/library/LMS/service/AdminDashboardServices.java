package com.meet.library.LMS.service;

import com.meet.library.LMS.dto.response.BookResponse;
import com.meet.library.LMS.dto.response.RecycleHubResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface AdminDashboardServices {

     Page<BookResponse> recommendBooksForUser(String email, Pageable pageable);
     Page<BookResponse> getTopRatedBook(Pageable pageable);

     Page<BookResponse> getTrendingBooksLast30Days(Pageable pageable);

     Page<BookResponse> getMostPopularBooks(Pageable pageable);
     Page<BookResponse> getBookBySubCategoryId(Long subCategoryId,Pageable pageable);

     RecycleHubResponse getRecycleHubDetails();


}
