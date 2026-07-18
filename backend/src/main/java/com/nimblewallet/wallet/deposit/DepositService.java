package com.nimblewallet.wallet.deposit;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.nimblewallet.wallet.deposit.internal.DepositOrderRepository;
import com.nimblewallet.wallet.ledger.LedgerService;
import com.nimblewallet.wallet.payment.RazorpayGateway;
import com.nimblewallet.wallet.shared.error.BusinessException;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Owns the "add money" lifecycle. The order's amount and owner are fixed here at
 * creation and read back at capture — so the webhook can never dictate how much
 * to credit or to whom. Capture is idempotent and routes crediting through the
 * ledger.
 */
@Service
public class DepositService {

    private final DepositOrderRepository orders;
    private final RazorpayGateway razorpay;
    private final LedgerService ledger;

    public DepositService(DepositOrderRepository orders, RazorpayGateway razorpay, LedgerService ledger) {
        this.orders = orders;
        this.razorpay = razorpay;
        this.ledger = ledger;
    }

    @Transactional
    public DepositOrderResponse createOrder(Long userId, long amountMinor) {
        if (amountMinor <= 0) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Amount must be greater than 0");
        }
        String receipt = "rcpt_" + userId + "_" + System.currentTimeMillis();
        String orderId = razorpay.createOrder(amountMinor, receipt);
        orders.save(new DepositOrder(userId, orderId, amountMinor));
        return new DepositOrderResponse(orderId, amountMinor, "INR", razorpay.publicKeyId());
    }

    /**
     * Completes a deposit. The conditional PENDING→COMPLETED claim makes this
     * idempotent: a replayed webhook claims 0 rows and credits nothing.
     */
    @Transactional
    public CaptureOutcome capture(String orderToken, String paymentMethod) {
        int claimed = orders.transitionFromPending(orderToken, DepositStatus.COMPLETED);
        if (claimed == 0) {
            return orders.findByOrderToken(orderToken).isPresent()
                    ? CaptureOutcome.ALREADY_PROCESSED
                    : CaptureOutcome.UNKNOWN_ORDER;
        }
        DepositOrder order = orders.findByOrderToken(orderToken).orElseThrow();
        if (paymentMethod != null) {
            order.recordPaymentMethod(paymentMethod);
        }
        ledger.credit(order.getUserId(), order.getAmountMinor());
        return CaptureOutcome.CAPTURED;
    }

    /** Marks the caller's own still-pending order as failed. */
    @Transactional
    public boolean markFailed(Long userId, String orderToken) {
        return orders.failPendingForUser(orderToken, userId) > 0;
    }

    @Transactional(readOnly = true)
    public List<DepositRecord> listForUser(Long userId) {
        return orders.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::toRecord)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DepositRecord> completedSince(Long userId, java.time.Instant since) {
        return orders.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .filter(o -> o.getStatus() == DepositStatus.COMPLETED && !o.getCreatedAt().isBefore(since))
                .map(this::toRecord)
                .toList();
    }

    private DepositRecord toRecord(DepositOrder o) {
        return new DepositRecord(o.getAmountMinor(), o.getCreatedAt(), o.getStatus(),
                o.getPaymentMethod(), o.getOrderToken());
    }

    @Transactional(readOnly = true)
    public List<DepositHistoryEntry> history(Long userId) {
        Map<String, Rollup> byMethod = new LinkedHashMap<>();
        for (DepositOrder order : orders.findByUserIdOrderByCreatedAtDesc(userId)) {
            String method = order.getPaymentMethod() != null ? order.getPaymentMethod() : "RAZORPAY";
            Rollup rollup = byMethod.computeIfAbsent(method, k -> new Rollup());
            rollup.count++;
            if (order.getStatus() == DepositStatus.COMPLETED) {
                rollup.completedCount++;
                rollup.totalAmountMinor += order.getAmountMinor();
            }
            if (rollup.lastUsedAt == null || order.getCreatedAt().isAfter(rollup.lastUsedAt)) {
                rollup.lastUsedAt = order.getCreatedAt();
            }
        }
        return byMethod.entrySet().stream()
                .map(e -> new DepositHistoryEntry(e.getKey(), e.getValue().count,
                        e.getValue().completedCount, e.getValue().totalAmountMinor, e.getValue().lastUsedAt))
                .toList();
    }

    private static final class Rollup {
        long count;
        long completedCount;
        long totalAmountMinor;
        Instant lastUsedAt;
    }
}
