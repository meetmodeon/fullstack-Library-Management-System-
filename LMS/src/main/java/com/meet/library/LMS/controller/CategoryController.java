package com.meet.library.LMS.controller;

import com.meet.library.LMS.dto.request.CategoryRequest;
import com.meet.library.LMS.dto.response.CategoryResponse;
import com.meet.library.LMS.service.CategoryService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RequestMapping("/categories")
@RestController
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Category Management",description = "Category Operation are done here")
@SecurityRequirement(name="BearerAuth")
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> addCategory(@Valid @RequestBody CategoryRequest categoryRequest){
        CategoryResponse created=categoryService.addCategory(categoryRequest);
        return ResponseEntity
                .created(URI.create("api/v1/categories/"+ created.categoryId()))
                .body(created);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest dto
    ){
        log.info("Request to update category id={} with data={}",id,dto);
        return ResponseEntity.ok(categoryService.updateCategory(id, dto));
    }

    @GetMapping
    public ResponseEntity<Page<CategoryResponse>> getAllCategories(
            @RequestParam(defaultValue = "0")int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ){
        Pageable pageable= PageRequest.of(
                page,
                size,
                direction.equalsIgnoreCase("asc")? Sort.by(sortBy).ascending()
                        :Sort.by(sortBy).descending()
        );
        return ResponseEntity.ok(categoryService.getAllCategory(pageable));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategoryById(@PathVariable Long id){
        log.info("Deleting category id={}",id);
        categoryService.deleteCategoryById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<CategoryResponse> getCategoryByName(@RequestParam String name){
        log.info("Fetching category by name={}",name);
        return ResponseEntity.ok(categoryService.getCategoryByName(name));
    }
}
