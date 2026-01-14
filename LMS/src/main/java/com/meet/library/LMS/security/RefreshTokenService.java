package com.meet.library.LMS.security;

import com.meet.library.LMS.entity.RefreshToken;
import com.meet.library.LMS.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public RefreshToken createRefreshToken(String email){
        refreshTokenRepository.deleteByEmail(email);

        RefreshToken refreshToken=RefreshToken.builder()
                .email(email)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plus(Duration.ofDays(60)))
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    public Boolean isExpireRefreshToken(RefreshToken token){
        if(token.getExpiryDate().isBefore(Instant.now())){
            refreshTokenRepository.delete(token);
            return true;
        }
        return false;
    }

    public Optional<RefreshToken> findByToken(String token){
        return refreshTokenRepository.findByToken(token);
    }
}