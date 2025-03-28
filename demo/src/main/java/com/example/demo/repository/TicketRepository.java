package com.example.demo.repository;

import com.example.demo.Entity.Ticket;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TicketRepository extends JpaRepository<Ticket, Long>{
    Optional<Ticket> findByTicketId(String ticketId);
    Page<Ticket> findByTicketIdContainingIgnoreCase(String ticketId, Pageable pageable);
    
    Page<Ticket> findAll(Pageable pageable);

    
    @Query("SELECT t FROM Ticket t WHERE LOWER(t.ticketId) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Ticket> searchTickets(@Param("search") String search, Pageable pageable);
    
}
