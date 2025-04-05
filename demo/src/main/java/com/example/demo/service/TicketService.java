package com.example.demo.service;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Ticket;
import com.example.demo.repository.TicketRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    
    public Page<Ticket> getAllTickets(Pageable pageable) {
        return ticketRepository.findAll(pageable);
    }

    public Page<Ticket> searchTickets(String search, Pageable pageable){
        return ticketRepository.searchTickets(search, pageable);
    }
    public boolean createTicket(String ticketNumber){
        if(ticketRepository.findByTicketId(ticketNumber).isPresent()) {
            return false;
        }
        Ticket ticket = new Ticket();
        ticket.setTicketId(ticketNumber);
        ticketRepository.save(ticket);
        return true;
    }

}
