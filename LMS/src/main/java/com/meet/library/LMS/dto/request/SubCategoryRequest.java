package com.meet.library.LMS.dto.request;

import com.meet.library.LMS.validation.OnCreate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;


public record SubCategoryRequest (
    @NotBlank(groups = OnCreate.class,message = "subcategory name is required")
    String name,

    String description,
    @NotNull(groups = OnCreate.class,message = "Category Id is required field")
   @Positive(groups = OnCreate.class,message = "Category id is must be positive")
    Long categoryId
){

}
