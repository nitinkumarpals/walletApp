package com.nimblewallet.wallet;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;
import org.springframework.modulith.docs.Documenter;

/**
 * Enforces the Spring Modulith boundaries: no module may reach into another
 * module's internals. Also generates C4/PlantUML module docs under
 * {@code target/spring-modulith-docs}.
 */
class ModularityTests {

    private final ApplicationModules modules = ApplicationModules.of(WalletApplication.class);

    @Test
    void verifiesModuleBoundaries() {
        modules.verify();
    }

    @Test
    void writesModuleDocumentation() {
        new Documenter(modules).writeDocumentation();
    }
}
