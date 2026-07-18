package com.nimblewallet.wallet.ledger;

/** Read model of a wallet balance, in minor units (paise). */
public record BalanceSnapshot(long amount, long locked) {
}
