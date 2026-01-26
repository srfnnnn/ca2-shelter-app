import { useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import { login } from "../services/api"; 
 
export default function Login() { 
  const navigate = useNavigate(); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [error, setError] = useState(""); 
  const [busy, setBusy] = useState(false); 
 
  async function handleSubmit(e) { 
    e.preventDefault(); 
    setBusy(true); 
    setError(""); 
 
    try { 
      const res = await login({ email, password }); 
      if (!res.ok) throw new Error(`HTTP ${res.status}`); 
      const data = await res.json(); 
 
      localStorage.setItem("token", data.token);  
      navigate("/");  
    } catch (e2) { 
      console.error(e2); 
      setError("Login failed"); 
    } finally { 
      setBusy(false); 
    } 
  } 
 
  return ( 
    <main>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Password:</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
        <button disabled={busy} type="submit">
          {busy ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  ); 
} 