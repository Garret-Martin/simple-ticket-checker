package com.example.demo.controller;

import java.util.Map;
import com.example.demo.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("/admin")
public class AdminController {
    UserService userService;
    @PostMapping("/create-user")
    public ResponseEntity<Map<String, String>> createUser(@RequestParam String username, @RequestParam String password, @RequestParam String role){
        if(userService.existsByUserName(username)){
            return ResponseEntity.badRequest().body(Map.of("message", "User already exists!"));
        }
        userService.registerUser(username, password, role);
        //TODO:add time created to user
        return ResponseEntity.ok(Map.of("message", "Account " + username + " created "));
    }
    //TODO
    /* 
    public ResponseEntity<Map<String, String>> setRole(@RequestParam String username, @RequestParam String role) {

    }
    */

}
