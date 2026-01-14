package com.meet.library.LMS.exception;

import com.meet.library.LMS.enums.ErrorCode;

public class UserNotFoundException extends RuntimeException{
    private ErrorCode errorCode;

    public UserNotFoundException(String msg){
        super(msg);
        errorCode=ErrorCode.USER_NOT_FOUND;
    }

    public ErrorCode getErrorCode(){
        return this.errorCode;
    }

}
