package com.nimblewallet.wallet.payment;

import com.nimblewallet.wallet.shared.config.WalletProperties;
import com.nimblewallet.wallet.shared.error.BusinessException;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

/**
 * Anti-corruption layer over the Razorpay SDK — the only place that talks to
 * Razorpay's order API. Razorpay is the sole funding rail.
 */
@Service
public class RazorpayGateway {

    private final RazorpayClient client;
    private final String keyId;

    public RazorpayGateway(WalletProperties properties) throws RazorpayException {
        WalletProperties.Razorpay razorpay = properties.razorpay();
        this.keyId = razorpay.keyId();
        this.client = new RazorpayClient(razorpay.keyId(), razorpay.keySecret());
    }

    /** Creates a Razorpay order for the given minor-unit amount and returns its id. */
    public String createOrder(long amountMinor, String receipt) {
        try {
            JSONObject options = new JSONObject();
            options.put("amount", amountMinor);
            options.put("currency", "INR");
            options.put("receipt", receipt);
            Order order = client.orders.create(options);
            return order.get("id");
        } catch (RazorpayException e) {
            throw new BusinessException(HttpStatus.BAD_GATEWAY,
                    "Failed to create payment order: " + e.getMessage());
        }
    }

    /** The public key id, handed to the browser to open Razorpay Checkout. */
    public String publicKeyId() {
        return keyId;
    }
}
