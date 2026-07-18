package com.nimblewallet.wallet.authentication.internal;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Date;

import javax.crypto.SecretKey;

import com.nimblewallet.wallet.shared.config.WalletProperties;
import com.nimblewallet.wallet.shared.security.AuthenticatedUser;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

/**
 * Issues and verifies the HS256 session JWT. Claims mirror the old backend
 * ({@code sub}=user id, {@code email}, {@code number}) so the frontend contract
 * is unchanged. The configured secret is hashed to a 256-bit key so any secret
 * length yields a valid HS256 key.
 */
@Component
public class JwtService {

    private final SecretKey key;
    private final long expiryMillis;

    public JwtService(WalletProperties properties) {
        this.key = deriveKey(properties.auth().jwtSecret());
        this.expiryMillis = properties.auth().jwtExpiry().toMillis();
    }

    public String issue(Long userId, String email, String phoneNumber) {
        Date now = new Date();
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("email", email)
                .claim("number", phoneNumber)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expiryMillis))
                .signWith(key)
                .compact();
    }

    public AuthenticatedUser parse(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return new AuthenticatedUser(
                Long.valueOf(claims.getSubject()),
                claims.get("email", String.class),
                claims.get("number", String.class));
    }

    private static SecretKey deriveKey(String secret) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(secret.getBytes(StandardCharsets.UTF_8));
            return Keys.hmacShaKeyFor(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }
}
