package com.meet.library.LMS.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.meet.library.LMS.entity.User;
import com.meet.library.LMS.enums.UserRole;
import com.meet.library.LMS.validation.OnCreate;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;


@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public record UserRequest (

    @NotBlank(groups = OnCreate.class,message = "User must required name")
    String name,

    @NotBlank(groups = OnCreate.class,message = "Email is required")
    @Email(groups = OnCreate.class,message = "Give proper email")
    String email,

    @Size(groups = OnCreate.class,max = 10,min =10,message = "please give 10 digit mobile number")
    String phoneNumber,

    @Size(groups = OnCreate.class,min = 8,message = "Please fill atleast 8 character")
    String password,
    MultipartFile profileImg,
   @Size(groups = OnCreate.class,min = 1,message = "please assign atleast 1 role")
   Set<UserRole> userRole
   ){

}
