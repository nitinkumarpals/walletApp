package com.nimblewallet.wallet.ledger;

import com.nimblewallet.wallet.ledger.internal.WalletBalanceRepository;
import com.nimblewallet.wallet.shared.error.BusinessException;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * The only component that mutates wallet balances. Both the deposit-capture and
 * peer-transfer flows route their money movement through here, so "one writer of
 * balances" is a real, enforceable invariant.
 */
@Service
public class LedgerService {

    private final WalletBalanceRepository balances;

    public LedgerService(WalletBalanceRepository balances) {
        this.balances = balances;
    }

    /** Opens a zero-balance wallet for a new user (idempotent). */
    @Transactional
    public void openAccount(Long userId) {
        if (balances.findByUserId(userId).isEmpty()) {
            balances.save(new WalletBalance(userId));
        }
    }

    @Transactional(readOnly = true)
    public BalanceSnapshot balanceOf(Long userId) {
        return balances.findByUserId(userId)
                .map(b -> new BalanceSnapshot(b.getAmountMinor(), b.getLockedMinor()))
                .orElse(new BalanceSnapshot(0, 0));
    }

    /** Credits a wallet (used by the deposit-capture flow). */
    @Transactional
    public void credit(Long userId, long amountMinor) {
        requirePositive(amountMinor);
        WalletBalance wallet = balances.findByUserIdForUpdate(userId)
                .orElseThrow(() -> new IllegalStateException("No wallet for user " + userId));
        wallet.credit(amountMinor);
    }

    /**
     * Moves money between two wallets atomically. Both rows are locked in a
     * consistent (ascending userId) order to avoid deadlocks, and the sender's
     * funds are verified under the lock.
     */
    @Transactional
    public void transfer(Long fromUserId, Long toUserId, long amountMinor) {
        requirePositive(amountMinor);

        Long firstToLock = Math.min(fromUserId, toUserId);
        Long secondToLock = Math.max(fromUserId, toUserId);
        WalletBalance first = lock(firstToLock);
        WalletBalance second = lock(secondToLock);

        WalletBalance from = first.getUserId().equals(fromUserId) ? first : second;
        WalletBalance to = (from == first) ? second : first;

        if (from.getAmountMinor() < amountMinor) {
            throw new BusinessException(HttpStatus.UNPROCESSABLE_ENTITY, "Insufficient balance");
        }
        from.debit(amountMinor);
        to.credit(amountMinor);
    }

    private WalletBalance lock(Long userId) {
        return balances.findByUserIdForUpdate(userId)
                .orElseThrow(() -> new IllegalStateException("No wallet for user " + userId));
    }

    private void requirePositive(long amountMinor) {
        if (amountMinor <= 0) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Amount must be greater than 0");
        }
    }
}
