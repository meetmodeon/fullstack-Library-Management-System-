package com.meet.library.LMS.service;

import com.meet.library.LMS.dto.request.SubCategoryRequest;
import com.meet.library.LMS.dto.response.SubCategoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Set;

public interface SubCategoryService {

    SubCategoryResponse addSubCategory(SubCategoryRequest dto);
    SubCategoryResponse updateSubCategory(Long subCategoryId, SubCategoryRequest dto);
    void deleteSubCategoryById(Long subCategoryId);
    SubCategoryResponse getSubCategoryById(Long subCategoryId);
    Page<SubCategoryResponse> getAllSubCategory(Pageable pageable);
    SubCategoryResponse getSubCategoryByName(String subCategoryName);
    Page<SubCategoryResponse> getSubCategoryByCategoryId(Long categoryId,Pageable pageable);
}
