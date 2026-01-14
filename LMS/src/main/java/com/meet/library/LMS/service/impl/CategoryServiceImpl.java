package com.meet.library.LMS.service.impl;

import com.meet.library.LMS.dto.request.CategoryRequest;
import com.meet.library.LMS.dto.response.CategoryResponse;
import com.meet.library.LMS.entity.Category;
import com.meet.library.LMS.exception.BadRequestException;
import com.meet.library.LMS.exception.CategoryNotFoundException;
import com.meet.library.LMS.repository.CategoryRepo;
import com.meet.library.LMS.service.CategoryService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepo categoryRepo;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public CategoryResponse addCategory(CategoryRequest dto) {
        Optional<Category> optionalCategory=categoryRepo.findByNameIgnoreCase(dto.name());
        if(optionalCategory.isPresent()){
            throw new BadRequestException("Category already exists");
        }
        Category category=new Category();
        category.setName(dto.name());
        return new CategoryResponse(categoryRepo.save(category));
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long categoryId, CategoryRequest dto) {
        Category category=getCategoryByItsId(categoryId);
        category.setName(dto.name());
        return new CategoryResponse(category);
    }

    @Override
    public CategoryResponse getCategoryById(Long categoryId) {
        Category category=getCategoryByItsId(categoryId);
        return new CategoryResponse(category);
    }

    @Override
    public Page<CategoryResponse> getAllCategory(Pageable pageable) {
        return categoryRepo.findAll(pageable).map(CategoryResponse::new);
    }

    @Override
    @Transactional
    public void deleteCategoryById(Long categoryId) {
        Optional<Category> optionalCategory=categoryRepo.findByCategoryId(categoryId);
        if(optionalCategory.isPresent()){
            categoryRepo.deleteById(categoryId);
        }else {
            throw new CategoryNotFoundException("Category not found with id:"+categoryId);
        }
    }

    @Override
    public CategoryResponse getCategoryByName(String categoryName) {
        Category category=categoryRepo.findByNameIgnoreCase(categoryName).orElseThrow(()->new CategoryNotFoundException("Category not found with name: "+categoryName));
        return new CategoryResponse(category);
    }
    @Override
    public Category getCategoryByItsId(Long categoryId){
        return categoryRepo.findByCategoryId(categoryId).orElseThrow(()->new EntityNotFoundException("Category not found with id: "+categoryId));
    }
}
