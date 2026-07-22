package com.nimblewallet.wallet.authentication.internal;

import com.nimblewallet.wallet.shared.config.WalletProperties;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

/**
 * Builds the httpOnly session cookie (name/secure flags from config), matching
 * the old backend's {@code Authentication} cookie semantics.
 */
@Component
public class AuthCookieFactory {

    private final WalletProperties.Auth auth;

    public AuthCookieFactory(WalletProperties properties) {
        this.auth = properties.auth();
    }

    public String cookieName() {
        return auth.cookieName();
    }

    public ResponseCookie issue(String token) {
        return ResponseCookie.from(auth.cookieName(), token)
                .httpOnly(true)
                .secure(auth.cookieSecure())
                .sameSite("Lax")
                .path("/")
                .maxAge(auth.jwtExpiry())
                .build();
    }

    public ResponseCookie clear() {
        return ResponseCookie.from(auth.cookieName(), "")
                .httpOnly(true)
                .secure(auth.cookieSecure())
                .sameSite("Lax")
                .path("/")
                .maxAge(0)
                .build();
    }
}
