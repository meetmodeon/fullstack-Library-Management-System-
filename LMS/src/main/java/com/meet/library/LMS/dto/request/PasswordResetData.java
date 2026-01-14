package com.meet.library.LMS.dto.request;

import com.meet.library.LMS.validation.OnCreate;
import com.meet.library.LMS.validation.OnUpdate;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record PasswordResetData(
        @NotBlank(groups = OnUpdate.class,message = "User Email is required to reset password")
        String email,
        @NotBlank(groups = OnUpdate.class,message = "OTP is required which is send to Email")
        String otp,
        @NotBlank(groups = OnCreate.class,message = "New Password is required to change password")
        String newPassword
) {
}
