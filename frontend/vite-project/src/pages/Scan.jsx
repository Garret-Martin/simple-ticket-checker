import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import styles from "./Scan.module.css";

function Scan() {
  const [serverResponse, setServerResponse] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: {
        width: 200,
        height: 200,
      },
      facingMode: "environment",
      fps: 5,
    });
    //Hide the file upload
    /*
    setTimeout(() => {
      document.getElementById("html5-qrcode-anchor-scan-type-change")?.remove();
    }, 0);
    */
    scanner.render(success, error);
    /*
    document.getElementById("reader").addEventListener("click", () => {
      scanner.render(success, error);
    })
      */

    async function success(result) {
      try {
        const response = await fetch(`/api/tickets/${result}`, {
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
  
    function error(err) {
      console.log(err);
    }
  }, {});
  

  return (
    <div className={styles.background}>
      <div id="reader" className={styles.scanner}>
        <div className="scanner-line"></div>
      </div>
      <div className={styles.result_container}>
        <a>{serverResponse}</a>
        </div>
    </div>
  );
}

export default Scan;
