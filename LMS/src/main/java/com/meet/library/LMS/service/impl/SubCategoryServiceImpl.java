package com.meet.library.LMS.service.impl;

import com.meet.library.LMS.dto.response.CategoryResponse;
import com.meet.library.LMS.dto.request.SubCategoryRequest;
import com.meet.library.LMS.dto.response.SubCategoryResponse;
import com.meet.library.LMS.entity.Category;
import com.meet.library.LMS.entity.SubCategory;
import com.meet.library.LMS.exception.CategoryNotFoundException;
import com.meet.library.LMS.repository.CategoryRepo;
import com.meet.library.LMS.repository.SubCategoryRepo;
import com.meet.library.LMS.service.CategoryService;
import com.meet.library.LMS.service.SubCategoryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubCategoryServiceImpl implements SubCategoryService {
    private final SubCategoryRepo subCategoryRepo;
    private final CategoryRepo categoryRepo;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public SubCategoryResponse addSubCategory(SubCategoryRequest dto) {
        log.info("the dto data is: "+dto);
        // Fetch the existing Category entity
        Category category = categoryRepo.findById(dto.categoryId())
                .orElseThrow(()->new CategoryNotFoundException("Category Not found with id:: "+dto.categoryId()));
        // Make sure categoryService returns Category entity, not DTO

        // Create SubCategory
        SubCategory subCategory = new SubCategory();
        subCategory.setName(dto.name());
        subCategory.setDescription(dto.description());
        subCategory.setCategory(category); // assign existing category

        // Save SubCategory
        SubCategory savedSubCategory = subCategoryRepo.save(subCategory);


        return new SubCategoryResponse(savedSubCategory);
    }

    @Override
    @Transactional
    public SubCategoryResponse updateSubCategory(Long subCategoryId, SubCategoryRequest dto) {
        // Fetch existing SubCategory
       SubCategory subCategory=getSubCategory(subCategoryId);
        subCategory.setName(
                dto.name()!=null? dto.name() : subCategory.getName()
        );
        subCategory.setDescription(dto.description()!=null
        ?dto.description()
                :subCategory.getDescription());

        // Fetch existing Category
        Category newCategory=dto.categoryId()==null
                ?categoryRepo.findByCategoryId(subCategory.getCategory().getCategoryId())
                .orElseThrow(()->new CategoryNotFoundException("Category Not found with id:: "+dto.categoryId()))
                :categoryRepo.findByCategoryId(dto.categoryId())
                .orElseThrow(()->new CategoryNotFoundException("Category Not found with id:: "+dto.categoryId()));
        if(!subCategory.getCategory().equals(newCategory)){
            //remove old category list
            subCategory.getCategory().removeSubCategory(subCategory);
            //adding new category list
            newCategory.addSubCategory(subCategory);

            //adding new category list in subcategory
            subCategory.setCategory(newCategory);
        }

        SubCategoryResponse subCategoryResponse =new SubCategoryResponse(subCategory);
        return subCategoryResponse;
    }

    private SubCategory getSubCategory(Long subCategoryId){
        SubCategory subCategory=subCategoryRepo.findBySubCategoryId(subCategoryId)
                .orElseThrow(()->new CategoryNotFoundException("SubCategory not found"));
        return subCategory;
    }


    @Override
    @Transactional
    public void deleteSubCategoryById(Long subCategoryId) {
        SubCategory subCategory=getSubCategory(subCategoryId);
        subCategory.getCategory().removeSubCategory(subCategory);
        subCategoryRepo.delete(subCategory);
    }

    @Override
    public SubCategoryResponse getSubCategoryById(Long subCategoryId) {
        SubCategory subCategory=getSubCategory(subCategoryId);
        return new SubCategoryResponse(subCategory);
    }

    @Override
    public Page<SubCategoryResponse> getAllSubCategory(Pageable pageable) {
        return subCategoryRepo.findAll(pageable).map(SubCategoryResponse::new);
    }

    @Override
    public SubCategoryResponse getSubCategoryByName(String subCategoryName) {
        SubCategory subCategory=subCategoryRepo.findByName(subCategoryName)
                .orElseThrow(()->new CategoryNotFoundException("Category not found with name"));
        return new SubCategoryResponse(subCategory);
    }

    @Override
    public Page<SubCategoryResponse> getSubCategoryByCategoryId(Long categoryId,Pageable pageable) {
        return subCategoryRepo.findByCategoryCategoryId(categoryId,pageable).map(SubCategoryResponse::new);
    }
}
