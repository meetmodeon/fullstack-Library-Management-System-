package com.meet.library.LMS.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;


public record LoginRequest (
    @Email(message = "Please enter correct email address")
    String email,
    @NotBlank(message = "Password is not blank")
    @Size(min = 2,max = 12,message = "Password size is min 2 and max 12")
    String password
    ){
}
