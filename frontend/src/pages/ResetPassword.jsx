import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp || !password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword: password,
        confirmPassword,
      });
      setSuccess(res.data?.message || "Password reset successfully.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Could not reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>🔑 Reset Password</h2>

        <p style={styles.text}>
          {email ? `Enter the OTP sent to ${email}` : "Enter the OTP sent to your email"} along
          with your new password.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            style={styles.input}
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <input
            type="password"
            style={styles.input}
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            style={styles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Resetting..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f1f5f9",
    padding: "20px",
    boxSizing: "border-box",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,.15)",
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
    fontWeight: "bold",
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
};