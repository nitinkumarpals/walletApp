package com.nimblewallet.wallet.deposit;

import java.time.Instant;

/** Per-payment-method rollup of a user's deposits (amounts in minor units). */
public record DepositHistoryEntry(
        String method,
        long count,
        long completedCount,
        long totalAmountMinor,
        Instant lastUsedAt) {
}
