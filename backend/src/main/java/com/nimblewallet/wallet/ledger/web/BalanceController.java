package com.nimblewallet.wallet.ledger.web;

import com.nimblewallet.wallet.ledger.BalanceSnapshot;
import com.nimblewallet.wallet.ledger.LedgerService;
import com.nimblewallet.wallet.shared.security.AuthenticatedUser;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BalanceController {

    private final LedgerService ledger;

    public BalanceController(LedgerService ledger) {
        this.ledger = ledger;
    }

    /** Current wallet balance, in minor units (paise). */
    @GetMapping("/balance")
    public BalanceSnapshot balance(@AuthenticationPrincipal AuthenticatedUser user) {
        return ledger.balanceOf(user.id());
    }
}
