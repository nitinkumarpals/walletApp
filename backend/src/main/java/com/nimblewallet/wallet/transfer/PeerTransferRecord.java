package com.nimblewallet.wallet.transfer;

import java.time.Instant;

/** Read model of a peer transfer (amounts in minor units). */
public record PeerTransferRecord(
        Long id,
        long amountMinor,
        Instant createdAt,
        Long fromUserId,
        Long toUserId) {
}
