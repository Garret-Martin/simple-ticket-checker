package com.example.demo.Entity;

import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ticket")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Ticket {
    @Id
    @Column(name = "ticket_id", unique = true, nullable = false)
    private String ticketId;

    @Column(name = "checked_in", nullable = false)
    private boolean checkedIn = false;

    private void generateTicketNumber(){
        this.ticketId = UUID.randomUUID().toString().replaceAll(ticketId, ticketId);
    }

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private LocalDateTime created_at;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    @Column(name = "checked_in_at")
    private LocalDateTime checkedInAt;

}
