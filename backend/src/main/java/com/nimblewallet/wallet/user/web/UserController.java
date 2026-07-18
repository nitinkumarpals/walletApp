package com.nimblewallet.wallet.user.web;

import com.nimblewallet.wallet.shared.security.AuthenticatedUser;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Exposes the current authenticated identity, derived from the JWT (no DB hit),
 * mirroring the old {@code GET /user/me} contract: {@code { user: {...} }}.
 */
@RestController
public class UserController {

    @GetMapping("/user/me")
    public MeResponse me(@AuthenticationPrincipal AuthenticatedUser principal) {
        return new MeResponse(new UserView(principal.id(), principal.email(), principal.phoneNumber()));
    }

    public record MeResponse(UserView user) {
    }

    public record UserView(Long id, String email, String number) {
    }
}
