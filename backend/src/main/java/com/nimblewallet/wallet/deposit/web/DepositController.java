package com.nimblewallet.wallet.deposit.web;

import java.util.List;
import java.util.Map;

import com.nimblewallet.wallet.deposit.DepositHistoryEntry;
import com.nimblewallet.wallet.deposit.DepositOrderResponse;
import com.nimblewallet.wallet.deposit.DepositService;
import com.nimblewallet.wallet.shared.security.AuthenticatedUser;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Authenticated "add money" endpoints (replaces the old /onramp/* routes). */
@RestController
@RequestMapping("/deposit")
public class DepositController {

    private final DepositService deposits;

    public DepositController(DepositService deposits) {
        this.deposits = deposits;
    }

    /** Creates a Razorpay order and records the pending deposit server-side. */
    @PostMapping("/order")
    public DepositOrderResponse createOrder(@AuthenticationPrincipal AuthenticatedUser user,
                                            @Valid @RequestBody CreateOrderRequest request) {
        return deposits.createOrder(user.id(), request.amount());
    }

    /** Marks the caller's own pending order as failed (client reported failure). */
    @PostMapping("/fail")
    public Map<String, Object> fail(@AuthenticationPrincipal AuthenticatedUser user,
                                    @Valid @RequestBody FailRequest request) {
        boolean updated = deposits.markFailed(user.id(), request.token());
        return Map.of("success", true, "updated", updated);
    }

    @GetMapping("/history")
    public List<DepositHistoryEntry> history(@AuthenticationPrincipal AuthenticatedUser user) {
        return deposits.history(user.id());
    }

    /** Amount is in minor units (paise). */
    public record CreateOrderRequest(@Positive long amount) {
    }

    public record FailRequest(@NotBlank String token) {
    }
}
