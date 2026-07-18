package com.nimblewallet.wallet.transfer;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.nimblewallet.wallet.ledger.LedgerService;
import com.nimblewallet.wallet.shared.error.BusinessException;
import com.nimblewallet.wallet.transfer.internal.PeerTransferRepository;
import com.nimblewallet.wallet.user.AppUser;
import com.nimblewallet.wallet.user.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Peer-to-peer transfers. Resolves the recipient, validates the request, and
 * moves the money through the ledger (which enforces locking + sufficient
 * funds), then records the transfer — all in one transaction.
 */
@Service
public class PeerTransferService {

    private final PeerTransferRepository transfers;
    private final UserService users;
    private final LedgerService ledger;

    public PeerTransferService(PeerTransferRepository transfers, UserService users, LedgerService ledger) {
        this.transfers = transfers;
        this.users = users;
        this.ledger = ledger;
    }

    @Transactional
    public void transfer(Long fromUserId, String recipientEmail, long amountMinor) {
        if (amountMinor <= 0) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Amount must be greater than 0");
        }
        AppUser recipient = users.findByEmail(recipientEmail)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "Recipient not found"));
        if (recipient.getId().equals(fromUserId)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "Cannot send money to yourself");
        }

        ledger.transfer(fromUserId, recipient.getId(), amountMinor);
        transfers.save(new PeerTransfer(fromUserId, recipient.getId(), amountMinor));
    }

    @Transactional(readOnly = true)
    public long countInvolving(Long userId) {
        return transfers.countInvolving(userId);
    }

    @Transactional(readOnly = true)
    public List<PeerTransferRecord> listInvolving(Long userId) {
        return transfers.findInvolving(userId).stream().map(this::toRecord).toList();
    }

    @Transactional(readOnly = true)
    public List<PeerTransferRecord> listInvolvingSince(Long userId, Instant since) {
        return transfers.findInvolvingSince(userId, since).stream().map(this::toRecord).toList();
    }

    @Transactional(readOnly = true)
    public List<RecipientView> recentRecipients(Long userId, int limit) {
        Map<Long, RecipientView> unique = new LinkedHashMap<>();
        for (PeerTransfer transfer : transfers.findByFromUserIdOrderByCreatedAtDesc(userId)) {
            if (unique.containsKey(transfer.getToUserId())) {
                continue;
            }
            users.findById(transfer.getToUserId())
                    .ifPresent(recipient -> unique.put(transfer.getToUserId(), toRecipient(recipient)));
            if (unique.size() >= limit) {
                break;
            }
        }
        return List.copyOf(unique.values());
    }

    private PeerTransferRecord toRecord(PeerTransfer p) {
        return new PeerTransferRecord(p.getId(), p.getAmountMinor(), p.getCreatedAt(),
                p.getFromUserId(), p.getToUserId());
    }

    private RecipientView toRecipient(AppUser user) {
        String display = user.getName() != null ? user.getName() : user.getEmail().split("@")[0];
        String initials = display.length() >= 2
                ? display.substring(0, 2).toUpperCase()
                : display.toUpperCase();
        return new RecipientView(display, user.getEmail(), initials);
    }
}
