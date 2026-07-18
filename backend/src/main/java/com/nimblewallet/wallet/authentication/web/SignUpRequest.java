package com.nimblewallet.wallet.authentication.web;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Signup payload. Validated server-side via Jakarta Bean Validation. */
public record SignUpRequest(
        @NotBlank String name,
        @NotBlank @Email String email,
        @NotBlank @Size(min = 8, message = "Password must be at least 8 characters") String password,
        @Pattern(regexp = "\\d{10}", message = "Phone number must be 10 digits") String number) {
}
