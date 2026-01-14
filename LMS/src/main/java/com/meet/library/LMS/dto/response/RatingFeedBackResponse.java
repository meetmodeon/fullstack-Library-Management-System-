package com.meet.library.LMS.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.meet.library.LMS.entity.RatingFeedback;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public record RatingFeedBackResponse (
    Long id,

    Integer rating,


    Long userId,

    Long bookId,

    List<String> comment,


    LocalDateTime createdAt,

    LocalDateTime updatedAt,

    Boolean active
){
    public RatingFeedBackResponse(RatingFeedback rating){
        this(rating.getId(), rating.getRating(), rating.getUser().getUserId(),rating.getBook().getBookId(),rating.getComment(),rating.getCreatedAt(),rating.getUpdatedAt(),rating.getActive());
    }
}
