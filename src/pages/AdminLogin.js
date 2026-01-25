import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL 

export default function AdminLogin({ setAdmin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important to send cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) throw new Error(data.message || "Login failed");

      setAdmin(true); // mark admin as logged in
      navigate("/admin/listings");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Admin Login</h2>
      {error && <div style={{ color: "red", marginBottom: 10 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <label>Email
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", marginBottom: 10 }} />
        </label>
        <label>Password
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", marginBottom: 10 }} />
        </label>
        <button type="submit" disabled={busy} style={{ width: "100%", padding: 10 }}>
          {busy ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
