package com.meet.library.LMS.controller;

import com.meet.library.LMS.dto.request.SubCategoryRequest;
import com.meet.library.LMS.dto.response.SubCategoryResponse;
import com.meet.library.LMS.service.SubCategoryService;
import com.meet.library.LMS.validation.OnCreate;
import com.meet.library.LMS.validation.OnUpdate;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Set;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/subCategories")
@Tag(name = "SubCategory Management",description = "CRUD operation for SubCategory")
@SecurityRequirement(name = "BearerAuth")
public class SubCategoryController {

    private final SubCategoryService subCategoryService;

    @PostMapping
    @PreAuthorize("hasAnyRole('LIBRARIAN','ADMIN')")
    public ResponseEntity<SubCategoryResponse> addSubCategory(@RequestBody @Validated(OnCreate.class) SubCategoryRequest dto){
        SubCategoryResponse created=subCategoryService.addSubCategory(dto);
        return ResponseEntity
                .created(URI.create("api/v1/subCategories/"+created.categoryId()))
                .body(created);

    }
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','LIBRARIAN')")
    public ResponseEntity<SubCategoryResponse> updateSubCategory(
            @PathVariable Long id,
            @RequestBody @Validated(OnUpdate.class) SubCategoryRequest dto
    ){
        log.info("Request to update subCategory id: {} with data={}",id,dto);
        return ResponseEntity.ok(subCategoryService.updateSubCategory(id,dto));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "BearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSubCategoryById(@PathVariable Long id){
        log.info("Deleting category id={}",id);
        subCategoryService.deleteSubCategoryById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubCategoryResponse> getSubCategoryId(@PathVariable Long id){
        return ResponseEntity.ok().body(subCategoryService.getSubCategoryById(id));
    }
    @GetMapping
    public ResponseEntity<Page<SubCategoryResponse>> getAllSubCategory(
            @RequestParam(defaultValue = "0") int page,
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
        return ResponseEntity.ok(subCategoryService.getAllSubCategory(pageable));
    }
    @GetMapping("/category")
    public ResponseEntity<Page<SubCategoryResponse>> getSubCategoryByCategoryId(
            @RequestParam(name = "categoryId") Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String name,
            @RequestParam(defaultValue = "asc") String direction
    ){
        Pageable pageable=PageRequest.of(
                page,
                size,
                direction.equalsIgnoreCase("asc")?Sort.by(name).ascending()
                        :Sort.by(name).descending()
        );
        return ResponseEntity.ok(subCategoryService.getSubCategoryByCategoryId(categoryId,pageable));
    }
}
