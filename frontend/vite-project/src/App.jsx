
import './App.css'
import { useState } from 'react'

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
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
      } else {
        alert("Invalid username or password");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error logging in.");
    }
  };
  


  return (
    <>
      <div>
      <form class="login" onSubmit={handleLogin}>
        <input type="text" placeholder="Username" value={username} onInput={(e) => setUsername(e.target.value)}></input>
        <input type="password" placeholder="Password" value={password} onInput={(e) => setPassword(e.target.value)}></input>
        <button>Login</button>
      </form>
      </div>
    </>
  )
}

export default App
