package org.example.jwt.exception;

import org.example.jwt.dto.ProblemDetail;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.security.SignatureException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ProblemDetail> handleBadCredentials(BadCredentialsException exception) {
        ProblemDetail errorDetail = ProblemDetail.builder()
                .type("about:blank")
                .title("Bad Credentials")
                .status(HttpStatus.UNAUTHORIZED.value())
                .detail("The username or password is incorrect")
                .instance(null)
                .description("The username or password is incorrect")
                .build();
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorDetail);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ProblemDetail> handleAccountStatusException(UsernameNotFoundException exception) {
        ProblemDetail errorDetail = ProblemDetail.builder()
                .type("about:blank")
                .title("Account Status Exception")
                .status(HttpStatus.FORBIDDEN.value())
                .detail("The account is locked")
                .instance(null)
                .description("The account is locked")
                .build();
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorDetail);
    }

    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<ProblemDetail> handleAccessDeniedException(org.springframework.security.access.AccessDeniedException exception) {
        ProblemDetail errorDetail = ProblemDetail.builder()
                .type("about:blank")
                .title("Access Denied")
                .status(HttpStatus.FORBIDDEN.value())
                .detail("You are not authorized to access this resource")
                .instance(null)
                .description("You are not authorized to access this resource")
                .build();
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorDetail);
    }

    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<ProblemDetail> handleSignatureException(SignatureException exception) {
        ProblemDetail errorDetail = ProblemDetail.builder()
                .type("about:blank")
                .title("Invalid JWT signature")
                .status(HttpStatus.UNAUTHORIZED.value())
                .detail("The JWT signature is invalid")
                .instance(null)
                .description("The JWT signature is invalid")
                .build();
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorDetail);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ProblemDetail> handleExpiredJwtException(ExpiredJwtException exception) {
        ProblemDetail errorDetail = ProblemDetail.builder()
                .type("about:blank")
                .title("JWT token has expired")
                .status(HttpStatus.UNAUTHORIZED.value())
                .detail("The JWT token has expired")
                .instance(null)
                .description("The JWT token has expired")
                .build();
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorDetail);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ProblemDetail> handleRuntimeException(RuntimeException exception) {
        ProblemDetail errorDetail = ProblemDetail.builder()
                .type("about:blank")
                .title("Bad Request")
                .status(HttpStatus.BAD_REQUEST.value())
                .detail(exception.getMessage())
                .instance(null)
                .description(exception.getMessage())
                .build();
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorDetail);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ProblemDetail> handleSecurityException(Exception exception) {
        ProblemDetail errorDetail = ProblemDetail.builder()
                .type("about:blank")
                .title("Internal Server Error")
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .detail("Unknown internal server error")
                .instance(null)
                .description("Unknown internal server error")
                .build();
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorDetail);
    }
}
