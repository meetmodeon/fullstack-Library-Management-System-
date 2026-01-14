package com.meet.library.LMS.exception;

import com.meet.library.LMS.enums.ErrorCode;

public class AlreadyRatedException extends RuntimeException{
    private ErrorCode errorCode;
    public AlreadyRatedException(String msg){
        super(msg);
        this.errorCode=ErrorCode.ALREADY_RATED;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
