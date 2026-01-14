package com.meet.library.LMS.dto.response;

import com.meet.library.LMS.entity.SubCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public record SubCategoryResponse(
    Long subCategoryId,
    String name,
    String description,
    Long categoryId
){
    public SubCategoryResponse(SubCategory subCategory){
        this(subCategory.getSubCategoryId(),subCategory.getName(),subCategory.getDescription(),subCategory.getCategory().getCategoryId());
    }

}
