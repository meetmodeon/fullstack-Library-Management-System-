package com.meet.library.LMS.repository;

import com.meet.library.LMS.entity.SubCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface SubCategoryRepo extends JpaRepository<SubCategory,Long> {
    Optional<SubCategory> findBySubCategoryId(Long subCategoryId);
    @Query("select s from SubCategory s")
    List<SubCategory> getAll();

    Optional<SubCategory> findByName(String subCategoryName);

    Page<SubCategory> findByCategoryCategoryId(Long categoryId, Pageable pageable);
}
