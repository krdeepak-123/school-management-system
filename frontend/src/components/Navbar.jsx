import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";

const ROLE_LABELS = {
  student: "Student",
  teacher: "Teacher",
  principal: "Principal",
  director: "Director",
  admin: "Administrator",
};

export default function Navbar() {
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
    <div style={styles.navbar}>
      <div>
        <h2 style={styles.title}>Paradise kids School Management System</h2>
        <p style={styles.subtitle}>{roleLabel} Dashboard</p>
      </div>

      <div style={styles.right}>
        <div style={styles.user}>
          <div style={styles.avatar}>{initial}</div>

          <div>
            <strong>{displayName}</strong>
            <br />
            <small>{roleLabel}</small>
          </div>
        </div>

        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    height: "70px",
    background: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 25px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  title: {
    margin: 0,
    color: "#1e293b",
  },

  subtitle: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  user: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#2563eb",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },

  logoutBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.2s",
  },
};