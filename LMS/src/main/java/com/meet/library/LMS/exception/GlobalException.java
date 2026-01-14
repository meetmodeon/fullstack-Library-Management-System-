package com.meet.library.LMS.exception;

import com.meet.library.LMS.dto.response.ErrorResponse;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalException {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> userNotFoundException(UserNotFoundException ex){
        return errorResponse(HttpStatus.NOT_FOUND,ex.getMessage(),ex);
    }

    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<ErrorResponse> categoryNotFoundException(CategoryNotFoundException ex){
      return errorResponse(HttpStatus.NOT_FOUND,ex.getMessage(),ex);
    }
    @ExceptionHandler(OverDueFineException.class)
    public ResponseEntity<ErrorResponse> overDueException(OverDueFineException ex){
        return errorResponse(HttpStatus.BAD_REQUEST,ex.getMessage(),ex);
    }
    @ExceptionHandler(AlreadyRatedException.class)
    public ResponseEntity<ErrorResponse> alreadyRated(AlreadyRatedException ex){
        return errorResponse(HttpStatus.ALREADY_REPORTED,ex.getMessage(),ex);
    }

    //Validation Exception
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex){
        String errors=ex.getBindingResult().getFieldErrors()
                .stream()
                .map(e->e.getField()+":"+e.getDefaultMessage())
                .collect(Collectors.joining(","));
        return errorResponse(HttpStatus.BAD_REQUEST,errors,ex);
    }

    //ConstraintViolationException
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException ex){
        return errorResponse(HttpStatus.BAD_REQUEST,ex.getMessage(),ex);
    }



//HTTP / SPRING Exception
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleInvalidJson(HttpMessageNotReadableException ex){
        return errorResponse(HttpStatus.BAD_REQUEST,ex.getMessage(),ex);
    }

    //MissingServletRequestParameter
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingParams(MissingServletRequestParameterException ex){
        return errorResponse(HttpStatus.BAD_REQUEST,ex.getParameterName()+" parameter is missing",ex);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleMethodNotSupported(HttpRequestMethodNotSupportedException ex) {
        return errorResponse(HttpStatus.METHOD_NOT_ALLOWED, ex.getMessage(), ex);
    }

    // =================== Database / Persistence Exceptions ===================
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrity(DataIntegrityViolationException ex) {
        return errorResponse(HttpStatus.CONFLICT, "Database error: " + ex.getMostSpecificCause().getMessage(), ex);
    }



    // =================== File / IO Exceptions ===================
    @ExceptionHandler(java.io.IOException.class)
    public ResponseEntity<ErrorResponse> handleIOException(java.io.IOException ex) {
        return errorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "File operation failed: " + ex.getMessage(), ex);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> exception(Exception ex){
        return errorResponse(HttpStatus.INTERNAL_SERVER_ERROR,"An unexpected error occured",ex);
    }
    private ResponseEntity<ErrorResponse> errorResponse(HttpStatus status,String msg,Exception ex){
        log.error("Exception: ",ex);
        ErrorResponse errorResponse=new ErrorResponse(
                status.getReasonPhrase(),
                msg,
                LocalDateTime.now(),
                status.value()
        );
        return ResponseEntity
                .status(status)
                .contentType(MediaType.APPLICATION_JSON)
                .body(errorResponse);
    }



}
