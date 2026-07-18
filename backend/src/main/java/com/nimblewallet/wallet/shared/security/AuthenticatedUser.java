package com.nimblewallet.wallet.shared.security;

/**
 * The authenticated principal, reconstructed from the JWT on every request and
 * exposed to controllers via {@code @AuthenticationPrincipal}. Lives in the
 * shared kernel so any module's controller can reference it without depending
 * on the authentication module's internals.
 */
public record AuthenticatedUser(Long id, String email, String phoneNumber) {
}
