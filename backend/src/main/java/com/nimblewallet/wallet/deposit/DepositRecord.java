package com.nimblewallet.wallet.deposit;

import java.time.Instant;

/** Read model of a deposit (amounts in minor units). */
public record DepositRecord(
        long amountMinor,
        Instant createdAt,
        DepositStatus status,
        String paymentMethod,
        String orderToken) {
}
