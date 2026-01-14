package com.meet.library.LMS.security;

import com.meet.library.LMS.entity.User;
import com.meet.library.LMS.repository.UserRepo;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepo userRepo;
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
       User user = userRepo.findByEmail(email)
                .orElseThrow(()->new EntityNotFoundException("Email is not found with :: "+email));


        return new CustomerUserDetails(
                user.getUserId(),
                user.getEmail(),
                user.getPassword(),
                user.getUserRole()
        );
    }
}
