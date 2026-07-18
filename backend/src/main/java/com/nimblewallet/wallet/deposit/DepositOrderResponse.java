package com.nimblewallet.wallet.deposit;

/**
 * Everything the browser needs to open Razorpay Checkout for a freshly created
 * order. Amount is in minor units (paise).
 */
public record DepositOrderResponse(String orderId, long amount, String currency, String keyId) {
}
