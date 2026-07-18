package com.nimblewallet.wallet.deposit;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

/**
 * A Razorpay-backed "add money" order. Created as {@code PENDING} at order time
 * with the amount fixed by the server; the webhook later transitions it to
 * {@code COMPLETED}/{@code FAILED}. The stored amount + userId are the source of
 * truth for crediting — never the webhook request body.
 */
@Entity
@Table(name = "deposit_order")
@Getter
public class DepositOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "order_token", nullable = false, unique = true)
    private String orderToken;

    @Column(name = "amount_minor", nullable = false)
    private long amountMinor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DepositStatus status;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected DepositOrder() {
        // for JPA
    }

    public DepositOrder(Long userId, String orderToken, long amountMinor) {
        this.userId = userId;
        this.orderToken = orderToken;
        this.amountMinor = amountMinor;
        this.status = DepositStatus.PENDING;
        this.createdAt = Instant.now();
    }

    /** Records the Razorpay method (UPI/CARD/…) reported at capture, for display. */
    public void recordPaymentMethod(String method) {
        this.paymentMethod = method;
    }
}
