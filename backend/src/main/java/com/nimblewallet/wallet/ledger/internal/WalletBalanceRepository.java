package com.nimblewallet.wallet.ledger.internal;

import java.util.Optional;

import com.nimblewallet.wallet.ledger.WalletBalance;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface WalletBalanceRepository extends JpaRepository<WalletBalance, Long> {

    Optional<WalletBalance> findByUserId(Long userId);

    /**
     * Acquires a row-level write lock ({@code SELECT ... FOR UPDATE}) so
     * concurrent debits/credits on the same wallet serialize and cannot
     * double-spend.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select b from WalletBalance b where b.userId = :userId")
    Optional<WalletBalance> findByUserIdForUpdate(@Param("userId") Long userId);
}
