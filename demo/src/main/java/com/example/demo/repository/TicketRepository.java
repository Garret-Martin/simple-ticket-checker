package com.example.demo.repository;

import com.example.demo.Entity.Ticket;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long>{
    Optional<Ticket> findByTicketId(String ticketId);
}
