package com.meet.library.LMS.exception;

import com.meet.library.LMS.enums.ErrorCode;
import lombok.Getter;

@Getter
public class BookNotFoundException extends RuntimeException {
    private ErrorCode errorCode;
    public BookNotFoundException(String s) {
        super(s);
        errorCode=ErrorCode.BOOK_NOT_FOUND;
    }

}
