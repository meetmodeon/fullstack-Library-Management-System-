package com.meet.library.LMS.controller;

import com.meet.library.LMS.dto.request.LoginRequest;
import com.meet.library.LMS.dto.request.PasswordResetData;
import com.meet.library.LMS.dto.request.UserRequest;
import com.meet.library.LMS.dto.response.LoginResponse;
import com.meet.library.LMS.dto.response.UserResponse;
import com.meet.library.LMS.service.OtpService;
import com.meet.library.LMS.service.UserService;
import com.meet.library.LMS.validation.OnCreate;
import com.meet.library.LMS.validation.OnUpdate;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/common")
@Slf4j
@Tag(name = "Common Operation",description = "Here perform common operation")
public class CommonController {
    private final UserService userService;
    private final OtpService otpService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/signIn")
    public ResponseEntity<LoginResponse> register(@Validated(OnCreate.class) @RequestBody UserRequest userRequest, HttpServletResponse response){
        log.info("user register with data= {}", userRequest);
        LoginResponse response1=userService.register(userRequest,response);
        return ResponseEntity
                .created(URI.create("/api/v1/common/"))
                .body(response1);
    }

    @PostMapping("/adminRegister")
    public ResponseEntity<LoginResponse> adminRegister(@RequestBody @Validated(OnCreate.class) UserRequest userRequest, HttpServletResponse response){
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.registerAsAdmin(userRequest,response));
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest request, HttpServletResponse response){
        return ResponseEntity.status(HttpStatus.OK).body(userService.login(request,response));
    }

    @PostMapping("/refreshToken")
    public ResponseEntity<LoginResponse> refreshToken(@CookieValue("refreshToken") String refreshToken){
        return ResponseEntity.ok(userService.refreshToken(refreshToken));
    }

    @Operation(summary = "send-Otp",description = "Give email and then send otp to the email")
    @PostMapping("otp/send-otp")
    public ResponseEntity<Map<String,String>> sendOtp(@RequestParam String email){
        Map<String,String> msg=new HashMap<>();
        if(otpService.findByEmail(email).isEmpty()){
            msg.put("message","User-not found");
            return ResponseEntity.badRequest().body(msg);
        }

        if(!otpService.canResendOtp(email)){
            msg.put("message","Wait before resending OTP");
            return ResponseEntity.badRequest().body(msg);
        }

        otpService.sendOtp(email);
        msg.put("message","OTP Send to email");

        return ResponseEntity.ok(msg);
    }

    @Operation(summary = "Change Password",description = "Give PasswordChange Data to change the password")
    @PostMapping("otp/change_password")
    public ResponseEntity<Map<String,String>> verifyOtpAndChangePassword(@RequestBody @Validated(OnCreate.class) PasswordResetData passwordResetData){
        Map<String,String> msg=userService.verifyOtpAndChangePassword(passwordResetData);
        return ResponseEntity.ok(msg);
    }
    @PostMapping("otp/verify")
    public ResponseEntity<Map<String,String>> verifyOtp(
            @RequestBody @Validated(OnUpdate.class) PasswordResetData data
    ){
        return ResponseEntity.ok(userService.verifyOtp(data.email(),data.otp()));
    }


}
