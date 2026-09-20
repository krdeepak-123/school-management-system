import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/auth";
import "../styles/login.css";
import "../styles/auth.css";

// Destinations come from the backend-provided role only.
const ROLE_DESTINATIONS = {
  student: "/student-dashboard",
  teacher: "/teacher-dashboard",
  principal: "/principal/dashboard",
  director: "/director/dashboard",
  admin: "/admin/dashboard",
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState(location.state?.registeredEmail || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(location.state?.registered || false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!identifier.trim() || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      // Role is resolved by the backend and returned with the token
      const data = await login(identifier.trim(), password);

      const destination = ROLE_DESTINATIONS[data.role] || "/dashboard";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">🏫 School Management System</h1>

        <p className="login-subtitle">Welcome Back! Please login to continue.</p>

        {success && (
          <div
            style={{
              background: "#dcfce7",
              color: "#166534",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontWeight: "bold",
            }}
          >
            ✅ Registration successful! Please login with your new account.
          </div>
        )}

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontWeight: "bold",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <input
            className="login-input"
            type="text"
            placeholder="User ID or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />

          <div style={{ position: "relative" }}>
            <input
              className="login-input"
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "15px",
                top: "13px",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <div className="login-options">
            <label>
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              {" "}Remember Me
            </label>

            <Link className="login-link" to="/forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <hr />

        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#64748b", fontSize: "18px" }}>
            Don't have an account?{" "}
            <Link className="login-link" to="/register">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}