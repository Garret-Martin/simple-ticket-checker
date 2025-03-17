package com.example.demo.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager, UserService userService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestParam String username, @RequestParam String password) {
        if(userService.existsByUserName(username)){
            return ResponseEntity.badRequest().body("User already exists!");
        }
        userService.registerUser(username, password, "USER");
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login") 
    public ResponseEntity<Map<String, String>> login(@RequestParam String username, @RequestParam String password) {
        try {
            Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(username, password)
            );
            return ResponseEntity.ok(Map.of(
            "message", "Authenticated",
            "username", authentication.getName()
            ));
        } catch (AuthenticationException e) {
            // TODO: handle exception
            return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
        }
        
    }
}
