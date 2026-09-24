import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await API.post("/auth/forgot-password", { email });
      const msg =
        res.data?.message || "If an account exists with that email, an OTP has been sent.";
      setMessage(msg);
      setTimeout(() => navigate(`/reset-password?email=${encodeURIComponent(email)}`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Could not send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>🔐 Forgot Password</h2>

        <p style={styles.text}>
          Enter your registered email address. We will send you a one-time password (OTP).
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p style={styles.error}>{error}</p>}
          {message && <p style={styles.success}>{message}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <Link to="/login" style={styles.link}>
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f1f5f9",
    padding: "20px",
    boxSizing: "border-box",
  },

  card: {
    width: "100%",
    maxWidth: "400px",
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,.1)",
    boxSizing: "border-box",
  },

  text: {
    color: "#64748b",
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  error: {
    color: "#dc2626",
    marginBottom: "12px",
    fontSize: "14px",
  },

  success: {
    color: "#16a34a",
    marginBottom: "12px",
    fontSize: "14px",
  },

  link: {
    display: "block",
    marginTop: "20px",
    textAlign: "center",
    textDecoration: "none",
  },
};