package com.example.demo.controller;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.Entity.Ticket;
import com.example.demo.repository.TicketRepository;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    private final TicketRepository ticketRepository;

    public TicketController(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }
    @GetMapping("/{ticketNumber}") 
    public ResponseEntity<Ticket> jsonCheckTicket(@PathVariable String ticketNumber) {
        Optional<Ticket> ticket = ticketRepository.findByTicketId(ticketNumber);
        if(ticket.isPresent()) { 
            return ResponseEntity.ok(ticket.get());
        }
        else {
            return ResponseEntity.notFound().build(); //404
        }
    }
    

    @PostMapping("/{ticketNumber}/check-in")
    public ResponseEntity<String> checkInTicket(@PathVariable String ticketNumber) {
        Optional<Ticket> ticket = ticketRepository.findByTicketId(ticketNumber);
        if(ticket.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid ticket");
        }
        else if(ticket.get().isCheckedIn()) {
            return ResponseEntity.badRequest().body("Ticket already checked in at " + ticket.get().getCheckedInAt());
        }
        else {
            ticket.get().setCheckedIn(true);
            ticket.get().setCheckedInAt(LocalDateTime.now());
            ticketRepository.save(ticket.get());
            return ResponseEntity.ok("Checked in succesfully at " + ticket.get().getCheckedInAt());
        }
    }
}
