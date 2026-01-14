package com.meet.library.LMS.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.meet.library.LMS.entity.Category;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

public record CategoryRequest (
    @NotEmpty(message = "Category name is not empty")
    String name
){

}
