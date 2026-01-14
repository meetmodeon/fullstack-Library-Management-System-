package com.meet.library.LMS.service.impl;

import com.meet.library.LMS.dto.request.LoginRequest;
import com.meet.library.LMS.dto.request.PasswordResetData;
import com.meet.library.LMS.dto.request.UserRequest;
import com.meet.library.LMS.dto.response.LoginResponse;
import com.meet.library.LMS.dto.response.UserResponse;
import com.meet.library.LMS.entity.RefreshToken;
import com.meet.library.LMS.entity.User;
import com.meet.library.LMS.enums.FileType;
import com.meet.library.LMS.enums.UserRole;
import com.meet.library.LMS.exception.BadRequestException;
import com.meet.library.LMS.exception.UserNotFoundException;
import com.meet.library.LMS.repository.UserRepo;
import com.meet.library.LMS.security.JwtService;
import com.meet.library.LMS.security.RefreshTokenService;
import com.meet.library.LMS.security.UserDetailsServiceImpl;
import com.meet.library.LMS.service.AnnouncementService;
import com.meet.library.LMS.service.BorrowedBookService;
import com.meet.library.LMS.service.OtpService;
import com.meet.library.LMS.service.UserService;
import com.meet.library.LMS.storage.FileStorageService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;


@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private String uploadDir="uploads/";
    private final OtpService otpService;

    private final ModelMapper modelMapper;

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;

    private final AuthenticationManager authenticationManager;

    private final UserDetailsServiceImpl userDetailsService;

    private final JwtService jwtService;

    private final RefreshTokenService refreshTokenService;
    private final AnnouncementService announcementService;
    private final BorrowedBookService borrowedBookService;
    private final FileStorageService fileStorageService;
    @Transactional
    @Override
    public LoginResponse register(UserRequest userRequest, HttpServletResponse response) {
        User user=new User();


        if(!userRequest.userRole().contains(UserRole.ADMIN)){
           user=modelMapper.map(userRequest,User.class);
        }
        user.setPassword(passwordEncoder.encode(userRequest.password()));
        User user1=userRepo.save(user);
        if(userRequest.profileImg() != null && !userRequest.profileImg().isEmpty() && !userRequest.email().isBlank()){
            String profileImageUrl=fileStorageService.upload(userRequest.profileImg(), FileType.USER_IMAGE,user1.getProfileImagePath()).fileName();
            user.setProfileImagePath(profileImageUrl);
        }
        LoginRequest login=new LoginRequest(user1.getEmail(),userRequest.password());
        return login(login,response);
    }



    @Override
    public LoginResponse login(LoginRequest request, HttpServletResponse response1) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(),request.password())
        );
        final UserDetails userDetails= userDetailsService.loadUserByUsername(request.email());
        Optional<User> user=userRepo.findByEmail(userDetails.getUsername());
        final String jwt=jwtService.generateToke(userDetails);
        final RefreshToken refreshToken=refreshTokenService.createRefreshToken(userDetails.getUsername());
        //To get overdue info
        borrowedBookService.getBorrowedByUserIdAndBorrowed(user.get().getUserId());

        if(user.isEmpty()){
            throw new EntityNotFoundException("User not found with email:: "+request.email());
        }

        LoginResponse response=new LoginResponse(jwt,refreshToken.getToken());
        Cookie cookie=new Cookie("refreshToken",response.refreshToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(30*24*60*60);
        response1.addCookie(cookie);

        announcementService.getUnreadCount();
        return response;
    }


    @Override
    public LoginResponse refreshToken(String refreshToken){
        RefreshToken token=refreshTokenService.findByToken(refreshToken)
                .orElseThrow(()->new RuntimeException("Invalid refresh token"));

        if(refreshTokenService.isExpireRefreshToken(token)){
            throw new BadRequestException("Refresh token is expire.Please login");
        }
        UserDetails userDetails=userDetailsService.loadUserByUsername(token.getEmail());
        String newJwt=jwtService.generateToke(userDetails);

        return  new LoginResponse(newJwt,token.getToken());
    }

    @Override
    @Transactional
    public void uploadProfile(String email, MultipartFile file) {
        User user=userRepo.findByEmail(email)
                .orElseThrow(()->new UserNotFoundException("User not found"));
       if(file!=null && !file.isEmpty()){
           user.setProfileImagePath(fileStorageService.upload(file,FileType.USER_IMAGE,user.getProfileImagePath()).fileName());
       }
       userRepo.save(user);
    }

    @Override
    @Transactional
    public LoginResponse registerAsAdmin(UserRequest request, HttpServletResponse response) {
        log.info("user Data: {}", request);
        User user=new User();
        if(!request.userRole().contains(UserRole.ADMIN)){
            throw new RuntimeException("User must be Admin login");
        }

        user=modelMapper.map(request,User.class);
        if(request.profileImg() != null && !request.profileImg().isEmpty()){
            user.setProfileImagePath(
                    fileStorageService.upload(request.profileImg(),FileType.USER_IMAGE,null).fileName()
            );
        }
        user.setPassword(passwordEncoder.encode(request.password()));
        User saved=userRepo.save(user);
        LoginResponse loginResponse=login(new LoginRequest(saved.getEmail(),request.password()),response);
        return loginResponse;

    }

    @Override
    public UserResponse getUserInfoByEmail(String email) {
        User user=userRepo.findByEmail(email)
                .orElseThrow(()-> new UserNotFoundException("User not found with email"+email));
        UserResponse userResponse =new UserResponse(user);
        return userResponse;
    }

    @Override
    @Transactional
    public UserResponse updateUserInfo(String email, UserRequest request) {
        User user=userRepo.findByEmail(email).orElseThrow(()->new UserNotFoundException("User not found with email: "+email));
        modelMapper.map(request,user);
        if(request.profileImg()!=null && !request.profileImg().isEmpty()){
            user.setProfileImagePath(fileStorageService.upload(request.profileImg(),FileType.USER_IMAGE,user.getProfileImagePath()).fileName());
        }
        UserResponse response=new UserResponse(user);
        return response;
    }

    @Override
    public Page<UserResponse> getAllUser(Pageable pageable) {
        return userRepo.findAll(pageable).map(UserResponse::new);
    }

    @Override
    public Page<UserResponse> getUserByRole(UserRole userRole,Pageable page) {
        return userRepo.findByUserRole(userRole,page).map(UserResponse::new);

    }

    @Override
    public Map<String, String> verifyOtp(String email, String otp) {
        Map<String,String> msg=new HashMap<>();
        if(!otpService.verifyOtp(email, otp)){
            throw new BadRequestException("Invalid or expired OTP");
        }
        msg.put("Ok","Otp is verified");
        return msg;
    }

    @Override
    @Transactional
    public Map<String, String> verifyOtpAndChangePassword(PasswordResetData passwordResetData) {
        Map<String,String> msg=new HashMap<>();

        User user=userRepo.findByEmail(passwordResetData.email()).orElseThrow(()->new UserNotFoundException("User not found with email"));
        user.setPassword(passwordEncoder.encode(passwordResetData.newPassword()));
        userRepo.save(user);
        msg.put("message","Password change successfully");
        return msg;
    }



}
