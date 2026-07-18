package com.nimblewallet.wallet.shared.error;

import org.springframework.http.HttpStatus;

/**
 * Base type for expected, client-facing business errors (e.g. duplicate email,
 * insufficient funds). Carries the HTTP status the API should return, so the
 * global handler can translate it into a proper 4xx {@code ProblemDetail}
 * instead of the old "HTTP 200 with an error message" anti-pattern.
 */
public class BusinessException extends RuntimeException {

    private final HttpStatus status;

    public BusinessException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus status() {
        return status;
    }
}
