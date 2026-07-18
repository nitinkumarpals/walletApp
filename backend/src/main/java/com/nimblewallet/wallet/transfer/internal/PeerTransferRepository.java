package com.nimblewallet.wallet.transfer.internal;

import java.time.Instant;
import java.util.List;

import com.nimblewallet.wallet.transfer.PeerTransfer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PeerTransferRepository extends JpaRepository<PeerTransfer, Long> {

    @Query("select p from PeerTransfer p where p.fromUserId = :userId or p.toUserId = :userId order by p.createdAt desc")
    List<PeerTransfer> findInvolving(@Param("userId") Long userId);

    @Query("""
            select p from PeerTransfer p
            where (p.fromUserId = :userId or p.toUserId = :userId) and p.createdAt >= :since
            order by p.createdAt desc
            """)
    List<PeerTransfer> findInvolvingSince(@Param("userId") Long userId, @Param("since") Instant since);

    @Query("select count(p) from PeerTransfer p where p.fromUserId = :userId or p.toUserId = :userId")
    long countInvolving(@Param("userId") Long userId);

    List<PeerTransfer> findByFromUserIdOrderByCreatedAtDesc(Long fromUserId);
}
