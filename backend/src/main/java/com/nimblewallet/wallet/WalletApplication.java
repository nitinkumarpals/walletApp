package com.nimblewallet.wallet;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.modulith.Modulithic;

/**
 * NimbleWallet backend — a Spring Modulith modular monolith.
 *
 * <p>Each direct sub-package of this one is an application module
 * (authentication, user, ledger, deposit, payment, transfer, activity, shared).
 * Module boundaries are enforced by {@code ModularityTests}.
 */
@Modulithic(systemName = "NimbleWallet")
@SpringBootApplication
@ConfigurationPropertiesScan
public class WalletApplication {

    public static void main(String[] args) {
        SpringApplication.run(WalletApplication.class, args);
    }
}
