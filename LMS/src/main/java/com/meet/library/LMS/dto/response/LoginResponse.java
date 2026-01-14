package com.meet.library.LMS.dto.response;

import com.meet.library.LMS.enums.UserRole;
import lombok.Builder;
import lombok.Data;

import java.util.Set;

public record LoginResponse (
    String jwt,
    String refreshToken
){
}
