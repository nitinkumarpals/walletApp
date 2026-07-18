package com.nimblewallet.wallet.deposit;

/** Result of processing a Razorpay capture webhook. */
public enum CaptureOutcome {
    CAPTURED,
    ALREADY_PROCESSED,
    UNKNOWN_ORDER
}
