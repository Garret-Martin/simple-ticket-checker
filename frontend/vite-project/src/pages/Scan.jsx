import { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import styles from './Scan.module.css';

function Scan() {

  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {

    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 300,
        height: 100,
      },
      fps: 5,
    });
  
    scanner.render(success, error);
  
    function success(result){
      scanner.clear();
      setScanResult(result);
    }
  
    function error(err) {
      console.log(err);
    }
  }, {});
  
  return (
    <div className={styles.background}>
      <div id="reader" className={styles.scanner}></div>
    </div>
  );
  
  }
  
  export default Scan;
  