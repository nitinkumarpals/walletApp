package com.nimblewallet.wallet.authentication;

import java.util.Optional;

import com.nimblewallet.wallet.ledger.LedgerService;
import com.nimblewallet.wallet.shared.error.BusinessException;
import com.nimblewallet.wallet.user.AppUser;
import com.nimblewallet.wallet.user.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Orchestrates account creation and credential verification, coordinating the
 * user module (identity) and the ledger module (opening a zero-balance wallet).
 * New users start at ₹0 — the old signup bonus is gone.
 */
@Service
public class AuthenticationService {

    private final UserService users;
    private final LedgerService ledger;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationService(UserService users, LedgerService ledger, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.ledger = ledger;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Registers a password account. If the email already belongs to a
     * Google-only account (no password), the password is attached to it instead
     * (account merge), matching the old behaviour.
     */
    @Transactional
    public AppUser register(String name, String email, String rawPassword, String phoneNumber) {
        Optional<AppUser> existingByEmail = users.findByEmail(email);
        if (existingByEmail.isPresent()) {
            AppUser existing = existingByEmail.get();
            if (existing.getGoogleId() != null && !existing.hasPassword()) {
                existing.attachPassword(passwordEncoder.encode(rawPassword), phoneNumber);
                return users.save(existing);
            }
            throw new BusinessException(HttpStatus.CONFLICT, "Email already exists");
        }
        if (users.nameExists(name)) {
            throw new BusinessException(HttpStatus.CONFLICT, "Username already exists");
        }
        if (users.phoneNumberExists(phoneNumber)) {
            throw new BusinessException(HttpStatus.CONFLICT, "Number already exists");
        }

        AppUser user = users.save(
                AppUser.withPassword(email, name, passwordEncoder.encode(rawPassword), phoneNumber));
        ledger.openAccount(user.getId());
        return user;
    }

    @Transactional(readOnly = true)
    public AppUser authenticate(String email, String rawPassword) {
        return users.findByEmail(email)
                .filter(AppUser::hasPassword)
                .filter(u -> passwordEncoder.matches(rawPassword, u.getPasswordHash()))
                .orElseThrow(() -> new BusinessException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
    }

    /** Finds or provisions a Google-authenticated user, linking existing accounts. */
    @Transactional
    public AppUser findOrCreateGoogleUser(String email, String name, String googleId) {
        Optional<AppUser> existing = users.findByEmail(email);
        if (existing.isPresent()) {
            AppUser user = existing.get();
            if (user.getGoogleId() == null || user.getAuthProvider() == null) {
                user.linkGoogle(googleId);
                users.save(user);
            }
            return user;
        }
        AppUser created = users.save(AppUser.fromGoogle(email, name, googleId));
        ledger.openAccount(created.getId());
        return created;
    }
}
