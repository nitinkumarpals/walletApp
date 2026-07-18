package com.nimblewallet.wallet.shared.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI/Swagger metadata. The generated {@code /v3/api-docs} document is the
 * contract the frontend's typed client is generated from.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI walletOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("NimbleWallet API")
                        .version("v1")
                        .description("""
                                Wallet backend (Spring Modulith): authentication, ledger,
                                deposits (Razorpay), peer transfers, and activity/analytics.
                                Session is a JWT carried in the httpOnly `Authentication` cookie."""))
                .components(new Components().addSecuritySchemes("cookieAuth",
                        new SecurityScheme()
                                .type(SecurityScheme.Type.APIKEY)
                                .in(SecurityScheme.In.COOKIE)
                                .name("Authentication")));
    }
}
