import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import styles from "./Scan.module.css";

function Scan() {
  const [serverResponse, setServerResponse] = useState("");
  const [textInput, setTextInput] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");
  const [checkInButtonVisible, setCheckInButtonVisible] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 200,
        height: 200,
      },
      facingMode: "environment",
      fps: 5,
    });
    scanner.render(success, error); //goes to function success or error

    async function success(result) {
      await fetchTicket(result); //result is the decoded ticket number
    }

    function error(err) {
      console.log(err);
    }
    
  }, []);
  async function checkTicketIn(ticketNumber) {
    try {
      const response = await fetch(`/api/tickets/${ticketNumber}/check-in`, {
        method: "POST",
        credentials: "include"
      });
      const data = await response.text();
      setServerResponse(data);
    } catch (error) {
      console.error("API error:", error);
      setServerResponse("Error fetching ticket information.");
    }

  }
  const handleCheckin = (e) => {
    e.preventDefault();
    checkTicketIn(ticketNumber);
  };
  const handleInput = (e) => {
    setTextInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if(e.key == "Enter") {
      e.preventDefault(); //no form submission
      fetchTicket(e.target.value.trim());
      setTextInput("");
    }
  }
  async function fetchTicket(ticketNumber) {
    setCheckInButtonVisible(false);
    try {
      const response = await fetch(`/api/tickets/${ticketNumber}`, {
        method: "GET",
        credentials: "include", // Ensures cookies are sent
      });
      if (!response.ok) {
        if (response.status == 404) {
          setServerResponse("Ticket not found.");
        } else {
          setServerResponse(`Error: ${response.statusText}`);
        }
        return; // Prevent further execution
      }
      const data = await response.json();
      if(data.checkedIn) { //ticket is checked in
        setServerResponse("Ticket already checked in at " + data.checkedInAt); 
      } else {  // ticket ready to be checked
        setServerResponse(data.ticketId);
        setTicketNumber(data.ticketId);
        setCheckInButtonVisible(true); //display check in button
      }
    } catch (error) { //does not catch 404
      console.error("API error:", error);
      setServerResponse("Error fetching ticket information.");
    }
  }
  //TODO: make fetchTicket receive json after implemented in backend
  //TODO: make the check in button work
  //TODO: componerize
  return (
    <div className={styles.background}>
      <div id="reader" className={styles.scanner}>
        <div className={styles.scannerLine}></div>
      </div>
      <div className={styles.userInput}>
          <input
            type="text"
            value={textInput}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            autoFocus
            placeholder="Barcode Scanner Input"
          ></input>
        </div>
      {serverResponse && 
      <div className={styles.result_container}>
        <a>{serverResponse}</a>
        {checkInButtonVisible && <button onClick={handleCheckin}>Check In</button>}
      </div>
      }
    </div>
  );
}

export default Scan;
