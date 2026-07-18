package com.nimblewallet.wallet.authentication.web;

import com.nimblewallet.wallet.authentication.AuthenticationService;
import com.nimblewallet.wallet.authentication.internal.AuthCookieFactory;
import com.nimblewallet.wallet.authentication.internal.JwtService;
import com.nimblewallet.wallet.user.AppUser;

import java.net.URI;

import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Email/password auth. On success an httpOnly {@code Authentication} cookie is
 * set (Google login is handled by the OAuth2 success handler). Paths mirror the
 * old backend so the existing frontend keeps working once repointed.
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationService authentication;
    private final JwtService jwtService;
    private final AuthCookieFactory cookieFactory;

    public AuthController(AuthenticationService authentication, JwtService jwtService,
                         AuthCookieFactory cookieFactory) {
        this.authentication = authentication;
        this.jwtService = jwtService;
        this.cookieFactory = cookieFactory;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AppUser user = authentication.authenticate(request.email(), request.password());
        return authenticated(user, "Logged in successfully");
    }

    @PostMapping("/sign-up")
    public ResponseEntity<AuthResponse> signUp(@Valid @RequestBody SignUpRequest request) {
        AppUser user = authentication.register(
                request.name(), request.email(), request.password(), request.number());
        return authenticated(user, "Signed up successfully");
    }

    /** Bridges the frontend's GET /auth/google to Spring's OAuth2 initiation URI. */
    @GetMapping("/google")
    public ResponseEntity<Void> googleLogin() {
        return ResponseEntity.status(302)
                .location(URI.create("/oauth2/authorization/google"))
                .build();
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout() {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookieFactory.clear().toString())
                .body(new AuthResponse(true, "Logged out successfully"));
    }

    private ResponseEntity<AuthResponse> authenticated(AppUser user, String message) {
        String token = jwtService.issue(user.getId(), user.getEmail(), user.getPhoneNumber());
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookieFactory.issue(token).toString())
                .body(new AuthResponse(true, message));
    }

    public record AuthResponse(boolean success, String message) {
    }
}
