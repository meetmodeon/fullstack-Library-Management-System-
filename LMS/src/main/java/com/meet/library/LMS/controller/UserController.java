package com.meet.library.LMS.controller;

import com.meet.library.LMS.dto.request.UserRequest;
import com.meet.library.LMS.dto.response.UserResponse;
import com.meet.library.LMS.enums.UserRole;
import com.meet.library.LMS.exception.BadRequestException;
import com.meet.library.LMS.service.AdminDashboardServices;
import com.meet.library.LMS.service.AnnouncementService;
import com.meet.library.LMS.service.UserService;
import com.meet.library.LMS.validation.OnUpdate;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
@Slf4j
@Tag(name = "User Management",description = "CRUD operation for User")
@SecurityRequirement(name = "BearerAuth")
public class UserController {
    private final UserService userService;
    private final AnnouncementService announcementService;
    private final AdminDashboardServices adminDashboardServices;
    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAllUser(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ){
        Pageable pageable= PageRequest.of(
                page,
                size,
                direction.equalsIgnoreCase("asc")? Sort.by(sortBy).ascending()
                        :Sort.by(sortBy).descending()
        );

        return ResponseEntity.ok(userService.getAllUser(pageable));
    }

    @PostMapping(
            value = "/uploadProfile",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Map<String,String>> uploadProfile(
            @RequestParam("img")MultipartFile img,
            Principal principal
    ){
        Map<String,String> map=new HashMap<>();
        userService.uploadProfile(principal.getName(),img);
        map.put("msg","Your image is upload successfully");
        return ResponseEntity.status(HttpStatus.OK).body(map);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable("email") String email){
        UserResponse userResponse =userService.getUserInfoByEmail(email);
        return ResponseEntity.ok(userResponse);
    }

    @GetMapping("/role")
    public ResponseEntity<Page<UserResponse>> getUserByRole(
            @RequestParam(name = "role") String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ){
        Pageable pageable=PageRequest.of(
                page,
                size,
                direction.equalsIgnoreCase("asc")?Sort.by(sortBy).ascending()
                        :Sort.by(sortBy).descending()
        );
        String userRole=role.toUpperCase();
        Page<UserResponse> userResponseList =switch (userRole){
            case "ADMIN"->userService.getUserByRole(UserRole.ADMIN,pageable);
            case "GUEST" ->userService.getUserByRole(UserRole.GUEST,pageable);
            case "STUDENT"->userService.getUserByRole(UserRole.STUDENT,pageable);
            case "TEACHER"->userService.getUserByRole(UserRole.TEACHER,pageable);
            default -> userService.getUserByRole(UserRole.LIBRARIAN,pageable);
        };
        return ResponseEntity.ok(userResponseList);
    }

    @PutMapping("/updateProfile")
    public ResponseEntity<UserResponse> updateUserInfo(
            Principal principal,
            @Validated(OnUpdate.class) @RequestBody UserRequest request
            ){
        return ResponseEntity.accepted().body(userService.updateUserInfo(principal.getName(),request));
    }

    @GetMapping(
            value = "/download/{email}",
            produces = MediaType.APPLICATION_OCTET_STREAM_VALUE
    )
    public ResponseEntity<Resource> downloadFile(
            @PathVariable String email
    ){
        try {
            UserResponse userResponse =userService.getUserInfoByEmail(
                    email
            );
            log.info("the user email is: "+userResponse.profileUrl());
            String profile= userResponse.profileUrl();
            if(profile==null || profile.isEmpty() || profile.isBlank()){
                throw new EntityNotFoundException("Profile image not download.Please upload your image");
            }
            Path filePath= Paths.get("upload/users/").resolve(userResponse.profileUrl()).normalize();
            if(!Files.exists(filePath)) return ResponseEntity.notFound().build();

            String contentType=Files.probeContentType(filePath);
            if(!((MediaType.IMAGE_PNG_VALUE.equals(contentType)
                    || MediaType.IMAGE_JPEG_VALUE.equals(contentType)
            ))){
                throw new BadRequestException("Only JPEG and PNG image allowed ");
            }

            Resource resource=new UrlResource(filePath.toUri());

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=\""+resource.getFilename()+"\"")
                    .body(resource);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/markAsRead/{id}")
    public ResponseEntity<Void> makeUnRead(@PathVariable Long id){
        announcementService.markAsRead(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }


}
