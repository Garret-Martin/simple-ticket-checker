import React, { useState, useEffect } from "react";
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import ClearIcon from '@mui/icons-material/Clear';
import "./Tickets.css"
import TicketList from "../Components/TicketList";


function Tickets() {
    const [currentPage, setCurrentPage] = useState(1);
    const [ticketsPerPage, setTicketsPerPage] = useState(50);
    const [loading, setLoading] = useState(false); //use when calling api
    const [tickets, setTickets] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    

    const indexOfLast = currentPage * ticketsPerPage;
    const indexOfFirst = indexOfLast - ticketsPerPage;
    const currentTickets = tickets.slice(indexOfFirst, indexOfLast);

    useEffect(() => {
        fetchTickets();
      }, [currentPage, ticketsPerPage, searchQuery]);

    async function fetchTickets() {
        setLoading(true);
        try {
          var response;
          if(searchQuery.length > 0) { //if we are searching
             response = await fetch(
              `http://localhost:8080/admin/tickets?search=${searchQuery}&page=${currentPage - 1}&size=${ticketsPerPage}`, {
                method: "GET",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json", // Ensure content type is JSON
                  "Accept": "application/json", // Accept JSON response
                  "Origin": "http://localhost:5173", // ✅ Explicitly specify frontend origin
                }
              }
            );
          }
          else {
             response = await fetch(
              `http://localhost:8080/admin/tickets?page=${currentPage - 1}&size=${ticketsPerPage}`, {
                method: "GET",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json", // Ensure content type is JSON
                  "Accept": "application/json", // Accept JSON response
                  "Origin": "http://localhost:5173", // ✅ Explicitly specify frontend origin
                }
              }
            );
          }
          if (!response.ok) {
            throw new Error("Failed to fetch tickets");
          }
          const data = await response.json();
          setTickets(data.content || []); // Assuming data.content holds paginated data
        } catch (error) {
          console.error("Error fetching tickets:", error);
        } finally {
          setLoading(false);
        }
      }


    return (
        <div>
            <div className="topArea">
                <div className="iconAndCreate">
                    <LocalActivityIcon id="icon"/>
                    <button id="createButton">New Ticket</button>
                </div>
                <div className="search">
                    <div id="icon" onClick={(e) => {setSearchQuery("")}}>
                      <ClearIcon/>
                    </div>
                    <input placeholder="Search" onInput={(e) => { setSearchQuery(e.target.value) } } value={searchQuery}/>
                </div>
            </div>
            <TicketList className="ticketList" tickets={tickets} loading={loading}></TicketList>
        </div>
    );
}

export default Tickets;