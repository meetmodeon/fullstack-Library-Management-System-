package com.meet.library.LMS.dto.response;


import com.meet.library.LMS.entity.User;
import com.meet.library.LMS.enums.UserRole;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

public record UserResponse (
     Long userId,
     String name,
     String email,
     String phoneNumber,
     String profileUrl,
     Set<UserRole> userRole
           ){
    public UserResponse(User user){
        this(user.getUserId(), user.getName(), user.getEmail(), user.getPhoneNumber(), user.getProfileImagePath(), user.getUserRole());
    }



}
