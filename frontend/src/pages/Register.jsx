import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import "../styles/auth.css";

const ROLES = [
  { value: "student", label: "Student", icon: "👨‍🎓" },
  { value: "teacher", label: "Teacher", icon: "👨‍🏫" },
  { value: "principal", label: "Principal", icon: "🧑‍🏫" },
  { value: "director", label: "Director", icon: "🏢" },
];

const USER_ID_LABELS = {
  student: "Admission No (from your student record)",
  teacher: "Teacher ID (from your joining record)",
  principal: "Staff User ID (choose a unique ID)",
  director: "Staff User ID (choose a unique ID)",
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (password) => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
const isValidMobile = (mobile) => /^\d{10,15}$/.test(mobile);

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("student");

  const [form, setForm] = useState({
    userId: "",
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs = {};

    if (!role) errs.role = "Please select a role";

    if (!form.userId.trim()) {
      errs.userId = `${ROLES.find((r) => r.value === role)?.label} ID is required`;
    }

    if (!form.name.trim()) errs.name = "Full name is required";

    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!isValidEmail(form.email)) {
      errs.email = "Enter a valid email address";
    }

    if (!form.mobile.trim()) {
      errs.mobile = "Mobile number is required";
    } else if (!isValidMobile(form.mobile)) {
      errs.mobile = "Mobile number must be 10-15 digits";
    }

    if (!form.password) {
      errs.password = "Password is required";
    } else if (form.password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    } else if (!isValidPassword(form.password)) {
      errs.password = "Password must include both letters and numbers";
    }

    if (!form.confirmPassword) {
      errs.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      return;
    }

    try {
      setLoading(true);

      await register({
        role,
        userId: form.userId.trim(),
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      navigate("/login", {
        state: { registered: true, registeredEmail: form.email.trim() },
      });
    } catch (err) {
      setApiError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const userIdLabel = USER_ID_LABELS[role] || "User ID";

  return (
    <div className="register-scroll">
      <div className="register-card">
        <h1 className="register-title">🏫 Create Account</h1>
        <p className="register-subtitle">
          Register to access the School Management System
        </p>

        {apiError && (
          <div className="auth-error">{apiError}</div>
        )}

        <div className="role-section">
          <h3>I am a...</h3>
          <div className="role-buttons">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                className={`role-btn ${role === r.value ? "active-role" : ""}`}
                onClick={() => {
                  setRole(r.value);
                  setErrors({ ...errors, role: "" });
                }}
              >
                {r.icon}
                <span>{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <input
            className={`register-input ${errors.userId ? "has-error" : ""}`}
            type="text"
            name="userId"
            placeholder={userIdLabel}
            value={form.userId}
            onChange={handleChange}
          />
          {errors.userId && <p className="field-error">{errors.userId}</p>}

          <input
            className={`register-input ${errors.name ? "has-error" : ""}`}
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}

          <input
            className={`register-input ${errors.email ? "has-error" : ""}`}
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}

          <input
            className={`register-input ${errors.mobile ? "has-error" : ""}`}
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={handleChange}
          />
          {errors.mobile && <p className="field-error">{errors.mobile}</p>}

          <input
            className={`register-input ${errors.password ? "has-error" : ""}`}
            type="password"
            name="password"
            placeholder="Password (min 8 chars, letters + numbers)"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && <p className="field-error">{errors.password}</p>}

          <input
            className={`register-input ${errors.confirmPassword ? "has-error" : ""}`}
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <p className="field-error">{errors.confirmPassword}</p>}

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="register-note">
          Already have an account?{" "}
          <Link className="login-link" to="/login">
            Login
          </Link>
        </p>

        <p className="register-note" style={{ marginTop: "8px" }}>
          Admin accounts cannot be created here. They are created by an existing administrator.
        </p>
      </div>
    </div>
  );
}