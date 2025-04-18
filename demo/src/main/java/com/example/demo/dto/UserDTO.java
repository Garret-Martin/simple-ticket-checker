package com.example.demo.dto;

import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

import com.example.demo.Entity.User;

import lombok.Getter;

@Getter
    @Setter
    public class UserDTO {
        private Long id;
        private String username;
        private Set<String> roles;
        private String createdBy;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public UserDTO(User user) {
            this.id = user.getId();
            this.username = user.getUsername();
            this.roles = user.getRoles();
            this.createdAt = user.getCreatedAt();
            this.updatedAt = user.getUpdatedAt();
            this.createdBy = user.getCreatedBy() != null ? user.getCreatedBy().getUsername() : "Unknown";
        }
    }
