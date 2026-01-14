package com.meet.library.LMS.enums;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    NOT_ACCESS_SERVICE(HttpStatus.NOT_ACCEPTABLE.name(),"Service is not access to this user"),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND.name(),"User Not found"),
    CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND.name(),"Category Not found"),
    BOOK_NOT_FOUND(HttpStatus.NO_CONTENT.name(),"Book not found" ),
    BAD_REQUEST(HttpStatus.BAD_REQUEST.name(),"Bad Request"),
    OVER_DUE(HttpStatus.BAD_REQUEST.name(), "OverDue Fine"),
    ALREADY_RATED(HttpStatus.ALREADY_REPORTED.name(),"User already give rating to the book")
    ;
    private String code;
    private String message;
    ErrorCode(String code,String message){
        this.message=message;
        this.code=code;
    }
}
