package com.meet.library.LMS.dto.response;

import java.time.LocalDateTime;

public record ErrorResponse(String error,String errorMessage,LocalDateTime timeStamp,int status) {
}
