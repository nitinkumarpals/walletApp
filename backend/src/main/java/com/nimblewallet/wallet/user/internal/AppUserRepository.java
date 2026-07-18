package com.nimblewallet.wallet.user.internal;

import java.util.Optional;

import com.nimblewallet.wallet.user.AppUser;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByName(String name);

    boolean existsByPhoneNumber(String phoneNumber);
}
