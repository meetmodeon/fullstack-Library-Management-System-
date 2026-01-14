package com.meet.library.LMS.service;

import com.meet.library.LMS.entity.User;

import java.util.Optional;

public interface OtpService {

    void sendOtp(String email);
    boolean verifyOtp(String email,String otp);
    boolean canResendOtp(String email);
    Optional<User> findByEmail(String email);
}
