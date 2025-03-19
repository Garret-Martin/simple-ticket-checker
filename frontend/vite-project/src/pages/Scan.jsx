import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import styles from "./Scan.module.css";

function Scan() {
  const [serverResponse, setServerResponse] = useState("");
  const [textInput, setTextInput] = useState("");

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
    try {
      const response = await fetch(`/api/tickets/${ticketNumber}`, {
        method: "GET",
        credentials: "include", // Ensures cookies are sent
      });
      const data = await response.text();
      setServerResponse(data);
    } catch (error) {
      console.error("API error:", error);
      setServerResponse("Error fetching ticket information.");
    }
  }

  return (
    <div className={styles.background}>
      <div id="reader" className={styles.scanner}>
        <div className={styles.scannerLine}></div>
      </div>
      <div className={styles.userInput}>
          {console.log("Rendering input...")}
          <input
            type="text"
            value={textInput}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            autoFocus
            placeholder="Barcode Scanner Input"
          ></input>
          {console.log("rednered")}
        </div>
      {serverResponse && 
      <div className={styles.result_container}>
        <a>{serverResponse}</a>
        <button>Check In</button>
      </div>
      }
    </div>
  );
}

export default Scan;
