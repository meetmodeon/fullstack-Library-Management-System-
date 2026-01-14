package com.meet.library.LMS.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.meet.library.LMS.enums.BookStatus;
import com.meet.library.LMS.validation.OnCreate;
import jakarta.validation.constraints.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public record BookRequest(

        @Size(groups = OnCreate.class,max = 255,message = "Book name cannot exceed 255 characters")
        @NotBlank(groups = OnCreate.class,message = "Book name is required")
        String name,

        @NotBlank(groups = OnCreate.class,message = "ISBN number is required")
        @Pattern(groups = OnCreate.class,regexp = "\\d+",message = "ISBN must be numeric")
        String isbn,

        MultipartFile bookImageFile,
        MultipartFile bookPdfFile,
        @NotEmpty(groups = OnCreate.class,message = "Author name must required")
        Set<String> author,
        @NotBlank(groups = OnCreate.class,message = "Publication of book must be required")
        String publication,
        @Size(max = 5000,message = "Only take max length 500")
        String detail,
        @NotNull(groups = OnCreate.class, message = "SubCategory Id is required")
        @Positive(groups = OnCreate.class, message = "SubCategory Id must be positive")
        Long subCategoriesId
) {
}
