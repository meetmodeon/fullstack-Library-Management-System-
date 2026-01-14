package com.meet.library.LMS.exception;

import com.meet.library.LMS.enums.ErrorCode;
import lombok.Getter;
import org.springframework.http.HttpStatus;
@Getter
public class CategoryNotFoundException extends RuntimeException{
    private ErrorCode errorCode;

    public CategoryNotFoundException(String msg){
        super(msg);
        this.errorCode= ErrorCode.USER_NOT_FOUND;
    }

}
