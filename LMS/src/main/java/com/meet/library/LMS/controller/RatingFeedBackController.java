package com.meet.library.LMS.controller;

import com.meet.library.LMS.dto.request.DeleteCommentRequest;
import com.meet.library.LMS.dto.request.UpdateCommentRequest;
import com.meet.library.LMS.dto.response.RatingFeedBackResponse;
import com.meet.library.LMS.dto.request.RatingRequest;
import com.meet.library.LMS.dto.response.RatingFeedbackDetailResponse;
import com.meet.library.LMS.dto.response.RatingUpperDetailsResponse;
import com.meet.library.LMS.service.RatingFeedBackService;
import com.meet.library.LMS.validation.OnCreate;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/ratings")
@Tag(name = "Rating Management",description = "Rating of Book operation perform here")
@SecurityRequirement(name = "BearerAuth")
public class RatingFeedBackController {
    private final RatingFeedBackService ratingFeedBackService;

    @PostMapping
    public ResponseEntity<RatingFeedBackResponse> giveBookRating(@RequestBody @Validated(OnCreate.class) RatingRequest dto){
        RatingFeedBackResponse created=ratingFeedBackService.createBookRating(dto);
        return ResponseEntity
                .created(URI.create("/api/v1/ratings/"+created.id()))
                .body(created);
    }

    @DeleteMapping
    public ResponseEntity<Map<String,String>> deleteFeedBack(
            @RequestParam Long ratingId,
            @RequestParam Long userId,
            @RequestParam Long bookId){
        ratingFeedBackService.deleteFeedBack(ratingId,userId,bookId);
        Map<String,String> msg=new HashMap<>();
        msg.put("msg","FeedBack deleted successfully");
        return ResponseEntity.ok(msg);
    }

    @GetMapping("/getAllBookRating")
    public ResponseEntity<Page<RatingFeedBackResponse>> getRatingFeedBackByUserId(
           @RequestParam Long bookId,
           @RequestParam(required = false,defaultValue = "0") int page,
           @RequestParam(required = false,defaultValue = "10") int size,
           @RequestParam(required = false,defaultValue = "createdAt") String sortBy,
           @RequestParam(required = false,defaultValue = "desc") String direction

            ){
        Pageable pageable= PageRequest.of(
                page,
                size,
                direction.equalsIgnoreCase("desc")? Sort.by(direction).descending():Sort.by(direction).ascending()
        );
        return ResponseEntity.ok(ratingFeedBackService.getRatingFeedBackByBookId(bookId,pageable));
    }

    @PutMapping("/addComment/{ratingId}")
    public ResponseEntity<Void> addComment(
           @PathVariable("ratingId") Long ratingId,
           @RequestParam String comment
    ){
        ratingFeedBackService.addComment(ratingId,comment);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PutMapping("/updateComment/{ratingId}")
    public ResponseEntity<Map<String,String>> updateComment(
            @RequestBody @Valid UpdateCommentRequest request
            ){
        Map<String,String> mapRes=new HashMap<>();
        String updatedComment= ratingFeedBackService.updateComment(request.id(),request.oldComment(),request.updateComment());
        mapRes.put("updatedComment",updatedComment);
        return ResponseEntity.ok(mapRes);
    }

    @DeleteMapping("/deleteComment")
    public ResponseEntity<Map<String,String>> deleteComment(
            @RequestBody @Valid DeleteCommentRequest request
            ){
        ratingFeedBackService.deleteComment(request.id(),request.comment());
        Map<String,String> mapRes=new HashMap<>();
        mapRes.put("message","Deleted comment");
        return ResponseEntity.ok(mapRes);
    }

    @GetMapping("/getAllByBookId")
    public ResponseEntity<List<RatingFeedbackDetailResponse>> getAllRatingByBookId(
                @RequestParam Long bookId,
                @RequestParam(required = false) Long cursor,
                @RequestParam(defaultValue = "5") int limit
        ){

        return ResponseEntity.ok(ratingFeedBackService.getAllRatingBasedOnBookId(bookId,cursor,limit));
        }

    @GetMapping("/getUpperRating")
    public ResponseEntity<RatingUpperDetailsResponse> getDetailsUpperRating(
            @RequestParam Long bookId
    ){
        return ResponseEntity.ok(ratingFeedBackService.getRatingDetailsByBookId(bookId));
    }
}
