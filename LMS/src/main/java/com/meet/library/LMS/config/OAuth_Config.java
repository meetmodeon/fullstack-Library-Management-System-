package com.meet.library.LMS.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.meet.library.LMS.dto.response.LoginResponse;
import com.meet.library.LMS.dto.response.UserResponse;
import com.meet.library.LMS.entity.RefreshToken;
import com.meet.library.LMS.entity.User;
import com.meet.library.LMS.enums.UserRole;
import com.meet.library.LMS.repository.UserRepo;
import com.meet.library.LMS.security.JwtService;
import com.meet.library.LMS.security.RefreshTokenService;
import com.meet.library.LMS.security.UserDetailsServiceImpl;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;
import java.util.Random;
import java.util.Set;

@Component
public class OAuth_Config extends SimpleUrlAuthenticationSuccessHandler {

    @Value("${frontEnd.url}")
    private String frontEndUrl;

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User=(OAuth2User) authentication.getPrincipal();


        String userName=oAuth2User.getAttribute("name");
        String email=oAuth2User.getAttribute("email");
        String imageUrl=oAuth2User.getAttribute("picture");
        if(email.isEmpty()||email==null){
            throw new BadRequestException("Please provide email");
        }
        if(userName==null || userName.isEmpty()){
            Random random=new Random();
            int num=random.nextInt(1000);
            userName="test"+num;
        }
        Optional<User> user=userRepo.findByEmail(email);
        User newUser=new User();
        if(user.isEmpty()){
            newUser.setUserRole(Set.of(UserRole.STUDENT));
            newUser.setEmail(email);
            newUser.setName(userName);
            newUser.setProfileImagePath(imageUrl);
        }else {
            newUser=user.get();
        }
        User returnUser=userRepo.save(newUser);
        RefreshToken refreshToken=refreshTokenService.createRefreshToken(returnUser.getEmail());
        UserDetails userDetails=userDetailsService.loadUserByUsername(returnUser.getEmail());
        String jwtToken=jwtService.generateToke(userDetails);

        LoginResponse loginResponse=new LoginResponse(jwtToken,refreshToken.getToken());

        Cookie cookie=new Cookie("refreshToken",refreshToken.getToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(30*24*60*60);
        response.addCookie(cookie);
        String redirectUrl= UriComponentsBuilder.fromUriString(frontEndUrl+"/login-callback")
                .queryParam("loginResponse",
                        URLEncoder.encode(
                                new ObjectMapper().writeValueAsString(loginResponse), StandardCharsets.UTF_8
                        )
                        )
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request,response,redirectUrl);


    }
}
