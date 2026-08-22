
import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/login.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [remember, setRemember] = useState(false);

  // DEFAULT ROLE
  const [role, setRole] = useState("admin");

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = (e) => {
    e.preventDefault();

    console.log("Login Button Clicked");
    console.log("Selected Role:", role);

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    // ROLE BASED LOGIN
    if (role === "admin") {
      alert("Admin Login Success");
    }

    if (role === "teacher") {
      alert("Teacher Login Success");
    }

    if (role === "student") {
      alert("Student Login Success");
    }

    // Parent ko role bhejna
    onLogin(role);
  };

  // ==========================================
  // DEMO ROLE LOGIN
  // ==========================================

  const selectRole = (selectedRole) => {
    setRole(selectedRole);
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="login-container">

      <div className="login-card">

        {/* TITLE */}

        <h1 className="login-title">
          🏫 School Management System
        </h1>

        <p className="login-subtitle">
          Welcome Back! Please login to continue.
        </p>

        {/* ROLE SELECT */}

        <div className="role-section">

          <h3>Select Login Role</h3>

          <div className="role-buttons">

            {/* ADMIN */}

            <button
              type="button"
              className={`role-btn ${
                role === "admin" ? "active-role" : ""
              }`}
              onClick={() => selectRole("admin")}
            >
              👨‍💼
              <span>Admin</span>
            </button>

            {/* TEACHER */}

            <button
              type="button"
              className={`role-btn ${
                role === "teacher" ? "active-role" : ""
              }`}
              onClick={() => selectRole("teacher")}
            >
              👨‍🏫
              <span>Teacher</span>
            </button>

            {/* STUDENT */}

            <button
              type="button"
              className={`role-btn ${
                role === "student" ? "active-role" : ""
              }`}
              onClick={() => selectRole("student")}
            >
              👨‍🎓
              <span>Student</span>
            </button>

          </div>

        </div>

        {/* SELECTED ROLE */}

        <div className="selected-role">
          Login as:{" "}
          <strong>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </strong>
        </div>

        {/* LOGIN FORM */}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <input
            className="login-input"
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}

          <div
            style={{
              position: "relative",
            }}
          >

            <input
              className="login-input"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <span
              onClick={() =>
                setShowPassword(!showPassword)
              }
              style={{
                position: "absolute",
                right: "15px",
                top: "13px",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              {showPassword
                ? "🙈"
                : "👁️"}
            </span>

          </div>

          {/* OPTIONS */}

          <div className="login-options">

            <label>

              <input
                type="checkbox"
                checked={remember}
                onChange={() =>
                  setRemember(!remember)
                }
              />

              {" "}Remember Me

            </label>

            <Link
              className="login-link"
              to="/forgot-password"
            >
              Forgot Password?
            </Link>

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="login-btn"
          >
            Login as{" "}
            {role.charAt(0).toUpperCase() +
              role.slice(1)}
          </button>

        </form>

      </div>

    </div>
  );
}


