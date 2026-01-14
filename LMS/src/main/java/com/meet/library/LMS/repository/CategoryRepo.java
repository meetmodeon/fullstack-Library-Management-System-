package com.meet.library.LMS.repository;

import com.meet.library.LMS.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface CategoryRepo extends JpaRepository<Category,Long> {
    Optional<Category> findByNameIgnoreCase(String name);
    @Query("select c from Category c")
    List<Category> getAll();

    Optional<Category> findByCategoryId(Long categoryId);
}
