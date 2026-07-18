package com.nimblewallet.wallet.shared.config;

import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Strongly-typed application configuration, bound from the {@code wallet.*}
 * namespace. Replaces the ad-hoc {@code process.env} reads of the old backend.
 */
@ConfigurationProperties(prefix = "wallet")
public record WalletProperties(
        Cors cors,
        Auth auth,
        Razorpay razorpay) {

    /** Cross-origin settings for the browser frontend. */
    public record Cors(String allowedOrigin) {
    }

    /** Authentication cookie + JWT settings. */
    public record Auth(
            String jwtSecret,
            Duration jwtExpiry,
            String cookieName,
            boolean cookieSecure,
            String postLoginRedirect) {
    }

    /** Razorpay API credentials (the sole funding rail). */
    public record Razorpay(String keyId, String keySecret) {
    }
}
