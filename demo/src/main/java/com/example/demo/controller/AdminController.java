package com.example.demo.controller;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.demo.Entity.Ticket;
import com.example.demo.Entity.User;
import com.example.demo.service.TicketService;
import com.example.demo.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@RestController()
@RequestMapping("/admin")
public class AdminController {
    UserService userService;
    TicketService ticketService;

    public AdminController(UserService userService, TicketService ticketService) {
        this.userService = userService;
        this.ticketService = ticketService;
    }

    @PostMapping("/create-user")
    public ResponseEntity<Map<String, String>> createUser(@RequestParam String username, @RequestParam String password,
            @RequestParam String role) {
        if (userService.existsByUserName(username)) {
            return ResponseEntity.badRequest().body(Map.of("message", "User already exists!"));
        }
        userService.registerUser(username, password, role);
        // TODO:add time created to user
        return ResponseEntity.ok(Map.of("message", "Account " + username + " created "));
    }

    // make it not give the password
    @GetMapping("/users")
    public ResponseEntity<Page<User>> getUsers(
            @RequestParam(required = false) String search, @RequestParam int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Direction.ASC, "id"));
        Page<User> users;
        if (search != null && !search.isEmpty()) {
            users = userService.searchUsers(search, pageable);
        } else {
            users = userService.getAllUsers(pageable);
        }
        return ResponseEntity.ok(users);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest request) {
        try {
            // Check if user exists
            if (!userService.existsById(id)) {
                return ResponseEntity.badRequest().body(Map.of("message", "User not found"));
            }

            // Check if username is already taken by another user
            if (request.getUsername() != null &&
                    userService.existsByUserName(request.getUsername()) &&
                    !userService.getUserById(id).getUsername().equals(request.getUsername())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Username already exists"));
            }

            // Convert roles array to Set if provided
            Set<String> rolesSet = null;
            if (request.getRoles() != null && request.getRoles().length > 0) {
                rolesSet = new HashSet<>();
                for (String role : request.getRoles()) {
                    rolesSet.add(role);
                }
            }

            // Update user
            User updatedUser = userService.updateUser(id, request.getUsername(),
                    request.getPassword(),
                    rolesSet);

            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to update user: " + e.getMessage()));
        }
    }

    @GetMapping("/tickets")
    public ResponseEntity<Page<Ticket>> getTickets(
            @RequestParam(required = false) String search,
            @RequestParam() int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Ticket> pageOftickets;
        if (search != null && !search.isEmpty()) {
            pageOftickets = ticketService.searchTickets(search, pageable);
        } else {
            pageOftickets = ticketService.getAllTickets(pageable);
        }
        return ResponseEntity.ok(pageOftickets);
    }

    // Request class for updating user
    public static class UpdateUserRequest {
        private String username;
        private String password;
        private String[] roles; // Keep as array for JSON serialization

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }

        public String[] getRoles() {
            return roles;
        }

        public void setRoles(String[] roles) {
            this.roles = roles;
        }
    }
}