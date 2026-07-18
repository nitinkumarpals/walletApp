package com.nimblewallet.wallet.user;

import java.util.Optional;

import com.nimblewallet.wallet.user.internal.AppUserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Public API of the user module: lookups and persistence of {@link AppUser}.
 * Other modules (authentication, transfer, activity) use this rather than
 * touching the repository directly.
 */
@Service
public class UserService {

    private final AppUserRepository users;

    public UserService(AppUserRepository users) {
        this.users = users;
    }

    @Transactional(readOnly = true)
    public Optional<AppUser> findByEmail(String email) {
        return users.findByEmail(email);
    }

    @Transactional(readOnly = true)
    public Optional<AppUser> findById(Long id) {
        return users.findById(id);
    }

    public boolean emailExists(String email) {
        return users.existsByEmail(email);
    }

    public boolean nameExists(String name) {
        return users.existsByName(name);
    }

    public boolean phoneNumberExists(String phoneNumber) {
        return phoneNumber != null && users.existsByPhoneNumber(phoneNumber);
    }

    @Transactional
    public AppUser save(AppUser user) {
        return users.save(user);
    }
}
