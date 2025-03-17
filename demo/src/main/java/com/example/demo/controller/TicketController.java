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
    public ResponseEntity<String> checkTicket(@PathVariable String ticketNumber) {
        Optional<Ticket> ticket = ticketRepository.findByTicketId(ticketNumber);
        if(ticket.isPresent()) {
            if(ticket.get().isCheckedIn()){
                return ResponseEntity.badRequest().body("Ticket already checked in at " + ticket.get().getCheckedInAt() + ".");
            }
            else{
                return ResponseEntity.ok("Ticket is valid");
            }
        }
        return ResponseEntity.badRequest().body("Invalid ticket");
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

    //eventuallty only allow to admin users
    @PostMapping("/create/{ticketNumber}")
    public ResponseEntity<String> createTicket(@PathVariable String ticketNumber) {
        if(ticketRepository.findByTicketId(ticketNumber).isPresent()) {
            return ResponseEntity.badRequest().body("Ticket already exists.");
        }
        Ticket ticket = new Ticket();
        ticket.setTicketId(ticketNumber);
        ticketRepository.save(ticket);
        return ResponseEntity.ok("Ticket created succesfully");
    }
}
