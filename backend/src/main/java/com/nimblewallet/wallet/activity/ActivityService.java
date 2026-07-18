package com.nimblewallet.wallet.activity;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import com.nimblewallet.wallet.deposit.DepositService;
import com.nimblewallet.wallet.transfer.PeerTransferService;
import com.nimblewallet.wallet.transfer.RecipientView;
import com.nimblewallet.wallet.user.AppUser;
import com.nimblewallet.wallet.user.UserService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Read/reporting module that composes data from the transfer and deposit
 * modules (via their public APIs) into user-facing statements and analytics.
 */
@Service
public class ActivityService {

    private static final int ANALYTICS_WINDOW_DAYS = 30;
    private static final int RECENT_RECIPIENT_LIMIT = 4;

    private final PeerTransferService transfers;
    private final DepositService deposits;
    private final UserService users;

    public ActivityService(PeerTransferService transfers, DepositService deposits, UserService users) {
        this.transfers = transfers;
        this.deposits = deposits;
        this.users = users;
    }

    @Transactional(readOnly = true)
    public StatementView statement(Long userId) {
        Map<Long, AppUser> counterpartyCache = new HashMap<>();

        List<StatementView.TransferEntry> transferEntries = transfers.listInvolving(userId).stream()
                .map(record -> {
                    boolean outgoing = record.fromUserId().equals(userId);
                    Long counterpartyId = outgoing ? record.toUserId() : record.fromUserId();
                    AppUser counterparty = counterpartyCache.computeIfAbsent(
                            counterpartyId, id -> users.findById(id).orElse(null));
                    return new StatementView.TransferEntry(
                            record.id(), record.amountMinor(), record.createdAt(),
                            outgoing ? "OUT" : "IN",
                            counterparty != null ? counterparty.getName() : null,
                            counterparty != null ? counterparty.getEmail() : null);
                })
                .toList();

        List<StatementView.DepositEntry> depositEntries = deposits.listForUser(userId).stream()
                .map(d -> new StatementView.DepositEntry(
                        d.amountMinor(), d.createdAt(), d.status().name(), d.paymentMethod(), d.orderToken()))
                .toList();

        return new StatementView(transferEntries, depositEntries);
    }

    @Transactional(readOnly = true)
    public long peerTransferCount(Long userId) {
        return transfers.countInvolving(userId);
    }

    @Transactional(readOnly = true)
    public List<RecipientView> recentRecipients(Long userId) {
        return transfers.recentRecipients(userId, RECENT_RECIPIENT_LIMIT);
    }

    @Transactional(readOnly = true)
    public AnalyticsView analytics(Long userId) {
        Instant now = Instant.now();
        Instant since = now.minus(ANALYTICS_WINDOW_DAYS, ChronoUnit.DAYS);

        // TreeMap keeps the days in ascending date order for the response.
        Map<LocalDate, long[]> buckets = new TreeMap<>();
        LocalDate today = LocalDate.ofInstant(now, ZoneOffset.UTC);
        for (int i = 0; i < ANALYTICS_WINDOW_DAYS; i++) {
            buckets.put(today.minusDays(i), new long[2]); // [inflow, outflow]
        }

        transfers.listInvolvingSince(userId, since).forEach(t -> {
            long[] bucket = buckets.get(LocalDate.ofInstant(t.createdAt(), ZoneOffset.UTC));
            if (bucket != null) {
                if (t.fromUserId().equals(userId)) {
                    bucket[1] += t.amountMinor();
                } else {
                    bucket[0] += t.amountMinor();
                }
            }
        });

        deposits.completedSince(userId, since).forEach(d -> {
            long[] bucket = buckets.get(LocalDate.ofInstant(d.createdAt(), ZoneOffset.UTC));
            if (bucket != null) {
                bucket[0] += d.amountMinor();
            }
        });

        List<AnalyticsView.DailyTotal> daily = buckets.entrySet().stream()
                .map(e -> new AnalyticsView.DailyTotal(e.getKey().toString(), e.getValue()[0], e.getValue()[1]))
                .toList();
        long totalIn = daily.stream().mapToLong(AnalyticsView.DailyTotal::inflowMinor).sum();
        long totalOut = daily.stream().mapToLong(AnalyticsView.DailyTotal::outflowMinor).sum();
        return new AnalyticsView(daily, totalIn, totalOut, totalIn - totalOut);
    }
}
