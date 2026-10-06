package com.barbersaas.api.core.exception;

import java.time.LocalDateTime;

public record ApiErrorDTO(
        LocalDateTime timestamp,
        Integer status,
        String error,
        String message
) {
}