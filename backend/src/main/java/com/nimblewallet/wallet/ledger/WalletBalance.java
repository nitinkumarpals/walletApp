package com.nimblewallet.wallet.ledger;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

/**
 * A user's wallet balance, in minor units (paise). Referenced across modules by
 * {@code userId} only (no JPA relation) to keep module boundaries clean.
 * Mutated exclusively through {@link LedgerService}.
 */
@Entity
@Table(name = "wallet_balance")
@Getter
public class WalletBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "amount_minor", nullable = false)
    private long amountMinor;

    @Column(name = "locked_minor", nullable = false)
    private long lockedMinor;

    protected WalletBalance() {
        // for JPA
    }

    public WalletBalance(Long userId) {
        this.userId = userId;
        this.amountMinor = 0;
        this.lockedMinor = 0;
    }

    void credit(long minor) {
        this.amountMinor += minor;
    }

    void debit(long minor) {
        this.amountMinor -= minor;
    }
}
