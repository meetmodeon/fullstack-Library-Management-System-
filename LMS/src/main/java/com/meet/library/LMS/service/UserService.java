package com.meet.library.LMS.service;

import com.meet.library.LMS.dto.request.LoginRequest;
import com.meet.library.LMS.dto.request.PasswordResetData;
import com.meet.library.LMS.dto.request.UserRequest;
import com.meet.library.LMS.dto.response.LoginResponse;
import com.meet.library.LMS.dto.response.UserResponse;
import com.meet.library.LMS.enums.UserRole;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface UserService {

    public LoginResponse register(UserRequest request, HttpServletResponse response);
    public LoginResponse login(LoginRequest request, HttpServletResponse response);
    public LoginResponse refreshToken(String refreshToken);
    public void uploadProfile(String email,MultipartFile img);
    public LoginResponse registerAsAdmin(UserRequest request,HttpServletResponse response);
    public UserResponse getUserInfoByEmail(String email);
    public UserResponse updateUserInfo(String email,UserRequest request);
    public Page<UserResponse> getAllUser(Pageable pageable);
    public Page<UserResponse> getUserByRole(UserRole userRole, Pageable pageable);
    public Map<String,String> verifyOtp(String email,String otp);
    public Map<String,String> verifyOtpAndChangePassword(PasswordResetData passwordResetData);

}
