package com.nimblewallet.wallet.deposit;

/** Lifecycle of a deposit (meaningful replacement for Processing/Success/Failure). */
public enum DepositStatus {
    PENDING,
    COMPLETED,
    FAILED
}
