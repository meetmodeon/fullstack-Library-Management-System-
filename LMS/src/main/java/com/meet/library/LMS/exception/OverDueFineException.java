package com.meet.library.LMS.exception;

import com.meet.library.LMS.enums.ErrorCode;
import lombok.Getter;

@Getter
public class OverDueFineException extends RuntimeException {
    private ErrorCode errorCode;

    public OverDueFineException(String msg){
        super(msg);
        errorCode=ErrorCode.OVER_DUE;
    }

}
