package com.nimblewallet.wallet.activity.web;

import java.util.List;

import com.nimblewallet.wallet.activity.ActivityService;
import com.nimblewallet.wallet.activity.AnalyticsView;
import com.nimblewallet.wallet.activity.StatementView;
import com.nimblewallet.wallet.shared.security.AuthenticatedUser;
import com.nimblewallet.wallet.transfer.RecipientView;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Read-only reporting endpoints (replaces the old /transactions/* routes). */
@RestController
@RequestMapping("/activity")
public class ActivityController {

    private final ActivityService activity;

    public ActivityController(ActivityService activity) {
        this.activity = activity;
    }

    @GetMapping
    public StatementView statement(@AuthenticationPrincipal AuthenticatedUser user) {
        return activity.statement(user.id());
    }

    @GetMapping("/p2p-count")
    public long peerTransferCount(@AuthenticationPrincipal AuthenticatedUser user) {
        return activity.peerTransferCount(user.id());
    }

    @GetMapping("/p2p-recipients")
    public List<RecipientView> recentRecipients(@AuthenticationPrincipal AuthenticatedUser user) {
        return activity.recentRecipients(user.id());
    }

    @GetMapping("/analytics")
    public AnalyticsView analytics(@AuthenticationPrincipal AuthenticatedUser user) {
        return activity.analytics(user.id());
    }
}
