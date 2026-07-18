/**
 * Shared kernel — cross-cutting types (money, error handling, configuration)
 * that every other module is allowed to depend on.
 *
 * <p>Declared {@code OPEN} so Spring Modulith permits other modules to use its
 * public types without tripping boundary verification.
 */
@org.springframework.modulith.ApplicationModule(
        type = org.springframework.modulith.ApplicationModule.Type.OPEN)
package com.nimblewallet.wallet.shared;
