import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.margin = 0;
    return () => {
      document.body.style.margin = "auto";
    }
  });

  const handleLogin = async (e) => {
    setErrorMessage("");
    e.preventDefault();
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (response.ok) {
        navigate("/scan"); // Redirect to dashboard
      } else if (response.status == 401){
        setErrorMessage("Invalid username or password.");
      }
      else{
        setErrorMessage("Error logging in. Response " + response.status);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Error logging in.");
    }
  };

  return (
    <div className={styles.background}>
      <form className={styles.login} onSubmit={handleLogin}>
        <input type="text" placeholder="Username" value={username} onInput={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onInput={(e) => setPassword(e.target.value)} />
        <button>Login</button>
        <a className={styles.errorMessage}>{errorMessage}</a>
      </form>
    </div>
  );
}

export default Login;
