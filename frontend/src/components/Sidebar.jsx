import { NavLink } from "react-router-dom";

const menus = [
  { name: "Dashboard", path: "/", icon: "🏠" },
  { name: "Students", path: "/students", icon: "👨‍🎓" },
  { name: "Teachers", path: "/teachers", icon: "👨‍🏫" },
  { name: "Classes", path: "/classes", icon: "📚" },
  { name: "Attendance", path: "/attendance", icon: "📅" },
  { name: "Fees", path: "/fees", icon: "💰" },
  { name: "Results", path: "/results", icon: "📝" },
];

export default function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.logo}>🏫 Paradise School MS</h2>

      {menus.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/"}
          style={({ isActive }) => ({
            ...styles.link,
            background: isActive ? "#2563eb" : "transparent",
            color: isActive ? "#fff" : "#e5e7eb",
          })}
        >
          <span>{item.icon}</span>
          <span>{item.name}</span>
        </NavLink>
      ))}
    </div>
  );
}

const styles = {
  sidebar: {
    width: "240px",
    background: "#0f172a",
    minHeight: "100vh",
    padding: "20px",
    boxSizing: "border-box",
  },

  logo: {
    color: "#fff",
    marginBottom: "30px",
    textAlign: "center",
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "16px",
    transition: "0.3s",
  },
};