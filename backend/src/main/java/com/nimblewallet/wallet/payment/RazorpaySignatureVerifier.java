package com.nimblewallet.wallet.payment;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import com.nimblewallet.wallet.shared.config.WalletProperties;

import org.springframework.stereotype.Component;

/**
 * Verifies Razorpay payment signatures: HMAC-SHA256 of
 * {@code "<order_id>|<payment_id>"} keyed with the Razorpay secret, compared in
 * constant time. This — not network isolation — is the real security control on
 * the capture path.
 */
@Component
public class RazorpaySignatureVerifier {

    private final String keySecret;

    public RazorpaySignatureVerifier(WalletProperties properties) {
        this.keySecret = properties.razorpay().keySecret();
    }

    public boolean isValid(String orderId, String paymentId, String signature) {
        if (orderId == null || paymentId == null || signature == null) {
            return false;
        }
        String expected = hmacSha256Hex(orderId + "|" + paymentId, keySecret);
        return MessageDigest.isEqual(
                expected.getBytes(StandardCharsets.UTF_8),
                signature.getBytes(StandardCharsets.UTF_8));
    }

    private static String hmacSha256Hex(String data, String key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] digest = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder(digest.length * 2);
            for (byte b : digest) {
                hex.append(Character.forDigit((b >> 4) & 0xF, 16));
                hex.append(Character.forDigit((b & 0xF), 16));
            }
            return hex.toString();
        } catch (Exception e) {
            throw new IllegalStateException("Unable to compute HMAC-SHA256", e);
        }
    }
}
