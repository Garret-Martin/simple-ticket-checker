package com.example.demo.dto;
import java.time.LocalDateTime;

import com.example.demo.Entity.Ticket;

import lombok.Getter;
import lombok.Setter;

@Getter
    @Setter
    public class TicketDTO {
        private String id;
        private String createdBy;
        private boolean checkedIn;
        private LocalDateTime checkedInAt;
        private LocalDateTime created_at;
        private LocalDateTime updatedAt;

        public TicketDTO(Ticket ticket) {
            this.id = ticket.getId();
            this.created_at = ticket.getCreated_at(); //TODO: rename to camelcase
            this.updatedAt = ticket.getUpdatedAt();
            this.createdBy = ticket.getCreatedBy() != null ? ticket.getCreatedBy().getUsername() : "Unknown";
            this.checkedIn = ticket.isCheckedIn();
            this.checkedInAt = ticket.getCheckedInAt();
            
        }
    }