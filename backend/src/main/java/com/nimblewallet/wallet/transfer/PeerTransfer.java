package com.nimblewallet.wallet.transfer;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

/** A completed peer-to-peer transfer. Amounts in minor units (paise). */
@Entity
@Table(name = "peer_transfer")
@Getter
public class PeerTransfer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "from_user_id", nullable = false)
    private Long fromUserId;

    @Column(name = "to_user_id", nullable = false)
    private Long toUserId;

    @Column(name = "amount_minor", nullable = false)
    private long amountMinor;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected PeerTransfer() {
        // for JPA
    }

    public PeerTransfer(Long fromUserId, Long toUserId, long amountMinor) {
        this.fromUserId = fromUserId;
        this.toUserId = toUserId;
        this.amountMinor = amountMinor;
        this.createdAt = Instant.now();
    }
}
