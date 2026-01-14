package com.meet.library.LMS.service;

import com.meet.library.LMS.dto.request.CategoryRequest;
import com.meet.library.LMS.dto.response.CategoryResponse;
import com.meet.library.LMS.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CategoryService {
    CategoryResponse addCategory(CategoryRequest dto);
    CategoryResponse updateCategory(Long categoryId, CategoryRequest dto);
    CategoryResponse getCategoryById(Long categoryId);
    Page<CategoryResponse> getAllCategory(Pageable pageable);
    void deleteCategoryById(Long categoryId);
    CategoryResponse getCategoryByName(String categoryName);
    Category getCategoryByItsId(Long categoryId);
}
