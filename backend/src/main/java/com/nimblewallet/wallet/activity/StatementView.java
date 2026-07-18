package com.nimblewallet.wallet.activity;

import java.time.Instant;
import java.util.List;

/**
 * A user's combined activity: peer transfers (with computed direction and
 * counterparty) and deposits. Amounts in minor units (paise).
 */
public record StatementView(List<TransferEntry> transfers, List<DepositEntry> deposits) {

    public record TransferEntry(
            Long id,
            long amountMinor,
            Instant createdAt,
            String direction,          // IN | OUT relative to the requesting user
            String counterpartyName,
            String counterpartyEmail) {
    }

    public record DepositEntry(
            long amountMinor,
            Instant createdAt,
            String status,
            String paymentMethod,
            String orderToken) {
    }
}
