package com.flowfund.engine.security;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(org.springframework.web.server.ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleStatus(org.springframework.web.server.ResponseStatusException ex) {
        return ResponseEntity.status(ex.getStatusCode()).body(Map.of("message", ex.getReason() == null ? "Request failed" : ex.getReason()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        Map<String, Object> body = new HashMap<>();
        
        if (ex.getMessage() != null && ex.getMessage().contains("Unrecognized date pattern")) {
            body.put("error", "Invalid date format");
            body.put("supported_formats", java.util.Arrays.asList("YYYY-MM-DD", "DD/MM/YYYY", "DD-MMM-YYYY", "YYYY-MMM-DD"));
            body.put("details", ex.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
        }
        
        body.put("message", "The request could not be completed.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolation(org.springframework.dao.DataIntegrityViolationException ex) {
        Map<String, String> body = new HashMap<>();
        String rootMsg = ex.getRootCause() != null ? ex.getRootCause().getMessage() : ex.getMessage();
        
        if (rootMsg.contains("UK6DOTKOTT2KJSP8VW4D0M25FB7_INDEX_4") || rootMsg.contains("USERS(EMAIL)")) {
            body.put("message", "This email is already registered. Try logging in instead!");
        } else {
            body.put("message", "A data conflict occurred. Please check your inputs.");
        }
        
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(org.springframework.http.converter.HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> handleJsonError(org.springframework.http.converter.HttpMessageNotReadableException ex) {
        Map<String, String> body = new HashMap<>();
        body.put("message", "We couldn't read your request. Please check if your inputs contain invalid symbols.");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }
}
