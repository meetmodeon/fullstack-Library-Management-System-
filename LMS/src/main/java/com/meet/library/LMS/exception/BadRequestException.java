package com.meet.library.LMS.exception;

import com.meet.library.LMS.enums.ErrorCode;

public class BadRequestException extends RuntimeException{
    private ErrorCode errorCode;
    public BadRequestException(String msg){
        super(msg);
        this.errorCode=ErrorCode.BAD_REQUEST;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
