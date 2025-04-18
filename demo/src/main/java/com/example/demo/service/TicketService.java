package com.example.demo.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Ticket;
import com.example.demo.dto.TicketDTO;
import com.example.demo.repository.TicketRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;

    public Page<TicketDTO> getAllTickets(Pageable pageable) {
        return ticketRepository.findAll(pageable)
            .map(TicketDTO::new);
    }

    public Page<TicketDTO> searchTickets(String search, Pageable pageable) {
        return ticketRepository.searchTickets(search, pageable)
            .map(TicketDTO::new);
    }

    public boolean createTicket(String ticketNumber) {
        if (ticketRepository.findById(ticketNumber).isPresent()) {
            return false;
        }
        Ticket ticket = new Ticket();
        ticket.setId(ticketNumber);
        ticketRepository.save(ticket);
        return true;
    }

}
