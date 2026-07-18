package com.nimblewallet.wallet.transfer;

/** A recent transfer recipient, for quick-send UI. */
public record RecipientView(String name, String email, String initials) {
}
