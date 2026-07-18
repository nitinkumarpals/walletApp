package com.nimblewallet.wallet.transfer.web;

import java.util.Map;

import com.nimblewallet.wallet.shared.security.AuthenticatedUser;
import com.nimblewallet.wallet.transfer.PeerTransferService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/transfer")
public class TransferController {

    private final PeerTransferService transfers;

    public TransferController(PeerTransferService transfers) {
        this.transfers = transfers;
    }

    /** Sends money to another user by email. Amount is in minor units (paise). */
    @PostMapping("/send")
    public Map<String, Object> transfer(@AuthenticationPrincipal AuthenticatedUser user,
                                        @Valid @RequestBody TransferRequest request) {
        transfers.transfer(user.id(), request.email(), request.amount());
        return Map.of("success", true, "message", "Transfer successful");
    }

    public record TransferRequest(
            @NotBlank @Email String email,
            @Positive long amount) {
    }
}
