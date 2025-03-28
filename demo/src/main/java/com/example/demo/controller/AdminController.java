package com.example.demo.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
import org.springframework.data.web.PageableDefault;

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
    public ResponseEntity<Map<String, String>> createUser(@RequestParam String username, @RequestParam String password, @RequestParam String role){
        if(userService.existsByUserName(username)){
            return ResponseEntity.badRequest().body(Map.of("message", "User already exists!"));
        }
        userService.registerUser(username, password, role);
        //TODO:add time created to user
        return ResponseEntity.ok(Map.of("message", "Account " + username + " created "));
    }

    //make it not give the password
    @GetMapping("/users")
    public ResponseEntity<Page<User>> getUsers(
            @RequestParam(required = false) String search, @RequestParam int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users;
        if (search != null && !search.isEmpty()) {
            users = userService.searchUsers(search, pageable);
        } else {
            users = userService.getAllUsers(pageable);
        }
        return ResponseEntity.ok(users);
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
    //TODO
    /* 
    public ResponseEntity<Map<String, String>> setRole(@RequestParam String username, @RequestParam String role) {

    }
    */

}
