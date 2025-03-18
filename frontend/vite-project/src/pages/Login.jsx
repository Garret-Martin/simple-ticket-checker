import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.margin = 0;
    return () => {
      document.body.style.margin = "auto";
    }
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    try {
      const response = await fetch("https://test.martinfamily.work/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Login Successful!");
        console.log(data);
        navigate("/scan"); // Redirect to dashboard
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error logging in.");
    }
  };

  return (
    <div className={styles.background}>
      <form className={styles.login} onSubmit={handleLogin}>
        <input type="text" placeholder="Username" value={username} onInput={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onInput={(e) => setPassword(e.target.value)} />
        <button>Login</button>
      </form>
    </div>
  );
}

export default Login;
