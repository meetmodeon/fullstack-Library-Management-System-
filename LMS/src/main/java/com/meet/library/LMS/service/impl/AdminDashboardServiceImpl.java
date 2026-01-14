package com.meet.library.LMS.service.impl;

import com.meet.library.LMS.dto.response.BookResponse;
import com.meet.library.LMS.dto.response.RecycleHubResponse;
import com.meet.library.LMS.entity.SubCategory;
import com.meet.library.LMS.entity.User;
import com.meet.library.LMS.enums.BorrowedStatus;
import com.meet.library.LMS.exception.UserNotFoundException;
import com.meet.library.LMS.repository.BookRepo;
import com.meet.library.LMS.repository.BorrowedRepo;
import com.meet.library.LMS.repository.SubCategoryRepo;
import com.meet.library.LMS.repository.UserRepo;
import com.meet.library.LMS.service.AdminDashboardServices;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardServices {

    private final SubCategoryRepo subCategoryRepo;
    private final BookRepo bookRepo;
    private final UserRepo userRepo;
    private final BorrowedRepo borrowedRepo;
    @Override
    public Page<BookResponse> recommendBooksForUser(String email,Pageable pageable) {
        User user=userRepo.findByEmail(email).orElseThrow(()->new UserNotFoundException("User not found with email is: "+email));
        Long userId=user.getUserId();
        if(borrowedRepo.existsByUserUserId(userId)){
            Long topSubCategoryId=borrowedRepo
                    .findMostBorrowedSubCategory(
                            userId,
                            List.of(BorrowedStatus.BORROWED,BorrowedStatus.RETURNED)
                    )
                    .stream()
                    .findFirst()
                    .map(row->(Long) row[0])
                    .orElse(null);
            if(topSubCategoryId !=null){
                List<Long> borrowedBookIds =
                        borrowedRepo.findBorrowedBookIds(userId);

                return bookRepo.recommendBooks(
                        topSubCategoryId,
                        borrowedBookIds,
                        pageable
                        )
                        .map(BookResponse::new);
            }
        }
        return getTopRatingBook(pageable);
    }

    @Override
    public Page<BookResponse> getTopRatedBook(Pageable pageable) {
        return getTopRatingBook(pageable);
    }

    @Override
    public Page<BookResponse> getTrendingBooksLast30Days(Pageable pageable) {
        return bookRepo
                .findTrendingBooksLast30Days(LocalDateTime.now().minusDays(30),pageable)
                .map(BookResponse::new);
    }

    @Override
    public Page<BookResponse> getMostPopularBooks(Pageable pageable) {
        return bookRepo
                .findMostPopularBooks(pageable)
                .map(BookResponse::new);
    }

    @Override
    public Page<BookResponse> getBookBySubCategoryId(Long subCategoryId, Pageable pageable) {
        return bookRepo.findBookBySubCategoryId(subCategoryId,pageable).map(BookResponse::new);
    }

    @Override
    public RecycleHubResponse getRecycleHubDetails() {
        Long totalBookCount=bookRepo.count();
        Long totalStudentCount=userRepo.count();
        LocalDateTime sixMonthAgo=LocalDateTime.now().minusMonths(6);
        Long studentCount= borrowedRepo.studentCount(sixMonthAgo);
        double growth=0.0;

        if(totalStudentCount>0){
            growth=((totalStudentCount-studentCount)*100.0)/totalStudentCount;
        }

        //Environmental saving(user double first, then convert if needed)
        Double co2Save=totalBookCount*0.4*0.5;
        Long paperSave=Math.round(totalBookCount*0.4);
        Long waterSave=Math.round(totalBookCount*0.4*120);
        Long energySave=Math.round(totalBookCount*0.4*1.2);

        RecycleHubResponse response=new RecycleHubResponse(
                totalBookCount,
                totalStudentCount,
                co2Save,
                growth,
                paperSave,
                waterSave,
                energySave
        );

        return response;
    }

    private Page<BookResponse> getTopRatingBook(Pageable pageable){
        return bookRepo
                .findTopRatedBooks(pageable)
                .map(BookResponse::new);
    }
}
