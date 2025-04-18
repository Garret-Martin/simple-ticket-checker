package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.Entity.Ticket;
import com.example.demo.Entity.User;
import com.example.demo.repository.TicketRepository;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

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

}
