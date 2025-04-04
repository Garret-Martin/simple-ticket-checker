package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.repository.UserRepository;
import com.example.demo.Entity.User;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(String username, String password, String role) {
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRoles(Set.of(role));
        return userRepository.save(user);
        
    }
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    } 
    public boolean existsById(Long id){
        return userRepository.existsById(id);
    }
    public User getUserById(Long id) {
        return userRepository.getById(id);
    }
   
    public User updateUser(Long id, String username, String password, Set<String> roles) {
        User user = getUserById(id);
        
        // Update username if provided
        if (username != null) {
            user.setUsername(username);
        }
        
        // Update password if provided
        if (password != null && !password.isEmpty()) {
            user.setPassword(passwordEncoder.encode(password));
        }
        
        // Update roles if provided
        if (roles != null && !roles.isEmpty()) {
            user.setRoles(roles);
        }
        
        // Update timestamp
        user.setUpdatedAt(LocalDateTime.now());
        
        return userRepository.save(user);
    }
    public boolean existsByUserName(String username){
        return userRepository.existsByUsername(username);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return org.springframework.security.core.userdetails.User
            .withUsername(user.getUsername())
            .password(user.getPassword())
            .roles(user.getRoles().toArray(new String[0]))
            .build();
    }    
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    // ✅ Search Users
    public Page<User> searchUsers(String search, Pageable pageable) {
        return userRepository.findByUsernameContainingIgnoreCaseOrRolesContainingIgnoreCase(search, search, pageable);
    }
}
