package com.school.sgai.security;

import com.school.sgai.entities.AppUser;
import com.school.sgai.repositories.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Bridge between our Database and Spring Security.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AppUserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser appUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Build a standard Spring Security User object
        return User.builder()
                .username(appUser.getUsername())
                .password(appUser.getPassword()) // It is encrypted
                .roles(appUser.getRole().name()) // ROLE_ADMIN, ROLE_STUDENT...
                .build();
    }
}
