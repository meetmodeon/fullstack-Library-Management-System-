package com.meet.library.LMS.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.meet.library.LMS.entity.Category;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

public record CategoryResponse (
        @NotEmpty(message = "Category id must be required")
    Long categoryId,
    @NotEmpty(message = "Category name is not empty")
    String name
    ){
    public CategoryResponse(Category category){
        this(category.getCategoryId(),category.getName());
    }
}
