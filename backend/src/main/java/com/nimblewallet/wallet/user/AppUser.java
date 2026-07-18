package com.nimblewallet.wallet.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

/**
 * A wallet user. Password is optional (Google-only accounts have none until the
 * user also signs up with a password). Balances/transactions reference this
 * aggregate by {@code id} only.
 */
@Entity
@Table(name = "app_user")
@Getter
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "phone_number", unique = true)
    private String phoneNumber;

    @Column(nullable = false)
    private String name;

    @Column(name = "google_id")
    private String googleId;

    @Column(name = "auth_provider")
    @Enumerated(EnumType.STRING)
    private AuthProvider authProvider;

    protected AppUser() {
        // for JPA
    }

    private AppUser(String email, String name, String passwordHash, String phoneNumber,
                    String googleId, AuthProvider authProvider) {
        this.email = email;
        this.name = name;
        this.passwordHash = passwordHash;
        this.phoneNumber = phoneNumber;
        this.googleId = googleId;
        this.authProvider = authProvider;
    }

    /** Creates a password-based account. */
    public static AppUser withPassword(String email, String name, String passwordHash, String phoneNumber) {
        return new AppUser(email, name, passwordHash, phoneNumber, null, null);
    }

    /** Creates a Google-authenticated account (no password). */
    public static AppUser fromGoogle(String email, String name, String googleId) {
        return new AppUser(email, name, null, null, googleId, AuthProvider.GOOGLE);
    }

    /** Links an existing account to Google. */
    public void linkGoogle(String googleId) {
        this.googleId = googleId;
        this.authProvider = AuthProvider.GOOGLE;
    }

    /** Sets a password on a previously password-less (Google-only) account. */
    public void attachPassword(String passwordHash, String phoneNumber) {
        this.passwordHash = passwordHash;
        this.phoneNumber = phoneNumber;
    }

    public boolean hasPassword() {
        return passwordHash != null;
    }
}
