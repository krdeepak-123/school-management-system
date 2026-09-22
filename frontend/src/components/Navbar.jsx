import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";

const ROLE_LABELS = {
  student: "Student",
  teacher: "Teacher",
  principal: "Principal",
  director: "Director",
  admin: "Administrator",
};

export default function Navbar({ onMenuClick = () => {} }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const roleLabel = ROLE_LABELS[user?.role] || "User";
  const displayName = user?.linkedData?.name || user?.name || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="navbar">
      <button
        type="button"
        className="navbar-toggler"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        ☰
      </button>

      <div className="navbar-brand">
        <h2 className="navbar-title">Paradise kids School Management System</h2>
        <p className="navbar-subtitle">{roleLabel} Dashboard</p>
      </div>

      <div className="navbar-right">
        <div className="navbar-user">
          <div className="navbar-avatar">{initial}</div>

          <div className="navbar-user-text">
            <strong>{displayName}</strong>
            <br />
            <small>{roleLabel}</small>
          </div>
        </div>

        <button onClick={handleLogout} className="navbar-logout">
          Logout
        </button>
      </div>
    </div>
  );
}