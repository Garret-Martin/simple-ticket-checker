import React from "react";

const TicketList = ({ tickets, loading }) => {
  if (loading) {
    return <h2>Loading...</h2>;
  }
  return (
    <ul className="list-group">
      {tickets.map((ticket, index) => (
        <div key={index} className="ticketItem">
          <li id="ticketNumber">Ticket ID: {ticket.ticketId}</li>
          <li id="checkedIn">Checked In: {ticket.checkedIn ? "Yes" : "No"}</li>
          <li id="createdAt">Created At: {new Date(ticket.created_at).toLocaleString()}</li>
          <li id="updatedAt">Updated At: {new Date(ticket.updatedAt).toLocaleString()}</li>
          <li id="checkedInAt">
            Checked In At: {new Date(ticket.checkedInAt).toLocaleString()}
          </li>
        </div>
      ))}
    </ul>
  );
};

export default TicketList;
