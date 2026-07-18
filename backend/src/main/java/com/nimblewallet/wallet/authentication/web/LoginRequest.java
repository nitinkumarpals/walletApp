package com.nimblewallet.wallet.authentication.web;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/** Login payload. */
public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank String password) {
}
