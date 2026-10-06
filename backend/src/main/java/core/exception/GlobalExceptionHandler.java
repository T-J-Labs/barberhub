package com.barbersaas.api.core.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice // Isso diz ao Spring: "Fique vigiando todos os Controllers!"
public class GlobalExceptionHandler {

    // Quando qualquer IllegalArgumentException for lançada, o Spring chama este método
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorDTO> handleIllegalArgumentException(IllegalArgumentException ex) {

        ApiErrorDTO error = new ApiErrorDTO(
                LocalDateTime.now(),
                HttpStatus.CONFLICT.value(), // Código 409 (Conflito)
                "Conflict",
                ex.getMessage() // Aqui vai a mensagem que escrevemos lá no Service!
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }
}