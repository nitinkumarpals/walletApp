package com.nimblewallet.wallet.deposit.internal;

import java.util.List;
import java.util.Optional;

import com.nimblewallet.wallet.deposit.DepositOrder;
import com.nimblewallet.wallet.deposit.DepositStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DepositOrderRepository extends JpaRepository<DepositOrder, Long> {

    Optional<DepositOrder> findByOrderToken(String orderToken);

    List<DepositOrder> findByUserIdOrderByCreatedAtDesc(Long userId);

    /**
     * Atomic, race-safe claim: flips the order to {@code toStatus} only if it is
     * still {@code PENDING}. Returns the number of rows changed (1 on the first
     * webhook, 0 on any replay) — the basis of idempotent capture.
     */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("""
            update DepositOrder d set d.status = :toStatus
            where d.orderToken = :orderToken and d.status = com.nimblewallet.wallet.deposit.DepositStatus.PENDING
            """)
    int transitionFromPending(@Param("orderToken") String orderToken,
                              @Param("toStatus") DepositStatus toStatus);

    /**
     * Same claim, scoped to the owning user — used when the user's own client
     * reports a failed payment.
     */
    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("""
            update DepositOrder d set d.status = com.nimblewallet.wallet.deposit.DepositStatus.FAILED
            where d.orderToken = :orderToken and d.userId = :userId
              and d.status = com.nimblewallet.wallet.deposit.DepositStatus.PENDING
            """)
    int failPendingForUser(@Param("orderToken") String orderToken, @Param("userId") Long userId);
}
