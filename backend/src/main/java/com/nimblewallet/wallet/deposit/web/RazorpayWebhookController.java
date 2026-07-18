package com.nimblewallet.wallet.deposit.web;

import java.util.Map;

import com.nimblewallet.wallet.deposit.CaptureOutcome;
import com.nimblewallet.wallet.deposit.DepositService;
import com.nimblewallet.wallet.payment.RazorpaySignatureVerifier;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Public Razorpay capture webhook (replaces the old Hono/Cloudflare worker).
 * Verifies the signature, then completes the deposit idempotently — crediting
 * the amount from the stored order, never from this request body.
 */
@RestController
@RequestMapping("/webhooks")
public class RazorpayWebhookController {

    private final RazorpaySignatureVerifier signatureVerifier;
    private final DepositService deposits;

    public RazorpayWebhookController(RazorpaySignatureVerifier signatureVerifier, DepositService deposits) {
        this.signatureVerifier = signatureVerifier;
        this.deposits = deposits;
    }

    @PostMapping("/razorpay")
    public ResponseEntity<Map<String, String>> capture(@RequestBody RazorpayCapturePayload payload) {
        boolean valid = signatureVerifier.isValid(
                payload.razorpay_order_id(), payload.razorpay_payment_id(), payload.razorpay_signature());
        if (!valid) {
            return ResponseEntity.badRequest().body(Map.of("error", "Transaction is not legit"));
        }

        CaptureOutcome outcome = deposits.capture(payload.razorpay_order_id(), null);
        return switch (outcome) {
            case CAPTURED -> ResponseEntity.ok(Map.of("message", "Captured"));
            case ALREADY_PROCESSED -> ResponseEntity.ok(Map.of("message", "Already processed"));
            case UNKNOWN_ORDER -> ResponseEntity.status(404).body(Map.of("error", "Unknown order"));
        };
    }

    /** Field names match Razorpay's callback payload exactly. */
    public record RazorpayCapturePayload(
            String razorpay_order_id,
            String razorpay_payment_id,
            String razorpay_signature) {
    }
}
