import { NavLink } from "react-router-dom";
import { useAuth } from "../context/auth";

const ALL_MENUS = [
  { id: "dashboard", name: "Dashboard", icon: "🏠", roles: ["admin", "principal", "director"], dashboard: true },
  { id: "student-dashboard", name: "Student Dashboard", path: "/student-dashboard", icon: "🎓", roles: ["student"] },
  { id: "student-profile", name: "My Profile", path: "/student/profile", icon: "👤", roles: ["student"] },
  { id: "student-attendance", name: "My Attendance", path: "/student/attendance", icon: "📅", roles: ["student"] },
  { id: "student-classes", name: "My Classes", path: "/student/classes", icon: "📚", roles: ["student"] },
  { id: "student-subjects", name: "My Subjects", path: "/student/subjects", icon: "📖", roles: ["student"] },
  { id: "student-timetable", name: "My Timetable", path: "/student/timetable", icon: "🕐", roles: ["student"] },
  { id: "student-results", name: "My Results", path: "/student/results", icon: "📝", roles: ["student"] },
  { id: "student-exams", name: "My Exams", path: "/student/exams", icon: "🧪", roles: ["student"] },
  { id: "student-fees", name: "My Fees", path: "/student/fees", icon: "💰", roles: ["student"] },
  { id: "student-receipts", name: "Fee Receipts", path: "/student/receipts", icon: "🧾", roles: ["student"] },
  { id: "student-assignments", name: "Assignments", path: "/student/assignments", icon: "📚", roles: ["student"] },
  { id: "student-materials", name: "Study Materials", path: "/student/materials", icon: "📁", roles: ["student"] },
  { id: "student-notices", name: "Notices", path: "/student/notices", icon: "📢", roles: ["student"] },
  { id: "student-leave", name: "Leave Application", path: "/student/leave", icon: "🗓️", roles: ["student"] },
  { id: "student-password", name: "Change Password", path: "/student/change-password", icon: "🔑", roles: ["student"] },
  { id: "teacher-dashboard", name: "Teacher Dashboard", path: "/teacher-dashboard", icon: "👨‍🏫", roles: ["teacher"] },
  { id: "teacher-profile", name: "My Profile", path: "/teacher/profile", icon: "👤", roles: ["teacher"] },
  { id: "teacher-classes", name: "My Classes", path: "/teacher/classes", icon: "📚", roles: ["teacher"] },
  { id: "teacher-subjects", name: "My Subjects", path: "/teacher/subjects", icon: "📖", roles: ["teacher"] },
  { id: "teacher-students", name: "Students", path: "/teacher/students", icon: "👨‍🎓", roles: ["teacher"] },
  { id: "teacher-attendance", name: "Attendance", path: "/teacher/attendance", icon: "📅", roles: ["teacher"] },
  { id: "teacher-assignments", name: "Assignments", path: "/teacher/assignments", icon: "📚", roles: ["teacher"] },
  { id: "teacher-materials", name: "Study Materials", path: "/teacher/materials", icon: "📁", roles: ["teacher"] },
  { id: "teacher-exams", name: "Exams", path: "/teacher/exams", icon: "🧪", roles: ["teacher"] },
  { id: "teacher-results", name: "Results", path: "/teacher/results", icon: "📝", roles: ["teacher"] },
  { id: "teacher-timetable", name: "Timetable", path: "/teacher/timetable", icon: "🕐", roles: ["teacher"] },
  { id: "teacher-leaves", name: "Leave Requests", path: "/teacher/leaves", icon: "🗓️", roles: ["teacher"] },
  { id: "teacher-notices", name: "Notices", path: "/teacher/notices", icon: "📢", roles: ["teacher"] },
  { id: "teacher-password", name: "Change Password", path: "/teacher/change-password", icon: "🔑", roles: ["teacher"] },
  { id: "students", name: "Students", path: "/students", icon: "👨‍🎓", roles: ["principal", "director", "admin"] },
  { id: "teachers", name: "Teachers", path: "/teachers", icon: "👨‍🏫", roles: ["principal", "director", "admin"] },
  { id: "classes", name: "Classes", path: "/classes", icon: "📚", roles: ["principal", "director", "admin"] },
  { id: "attendance", name: "Attendance", path: "/attendance", icon: "📅", roles: ["principal", "director", "admin"] },
  { id: "fees", name: "Fees", path: "/fees", icon: "💰", roles: ["principal", "director", "admin"] },
  { id: "results", name: "Results", path: "/results", icon: "📝", roles: ["principal", "director", "admin"] },
];

// Role-specific dashboard URLs (mirrors the backend role)
const DASHBOARD_PATHS = {
  admin: "/admin/dashboard",
  principals: "/principal/dashboard",
  director: "/director/dashboard",
};

export default function Sidebar({ open = false, onClose = () => {} }) {
  const { user } = useAuth();

  const role = user?.role;

  const menus = ALL_MENUS.filter((m) => m.roles.includes(role)).map((m) =>
    m.dashboard ? { ...m, path: DASHBOARD_PATHS[role] || "/dashboard" } : m
  );

  return (
    <>
      <div
        className={`sidebar-overlay ${open ? "sidebar-overlay--visible" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar-drawer ${open ? "sidebar-drawer--open" : ""}`}>
        <button
          type="button"
          className="sidebar-drawer-close"
          onClick={onClose}
          aria-label="Close menu"
        >
          ✕
        </button>

        <h2 style={styles.logo}>🏫 Paradise Kids School MS</h2>

        {role && (
          <div style={styles.roleBadge}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </div>
        )}

        {menus.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            end={Boolean(item.dashboard)}
            onClick={onClose}
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
      </aside>
    </>
  );
}

const styles = {
  logo: {
    color: "#fff",
    marginBottom: "10px",
    textAlign: "center",
  },

  roleBadge: {
    background: "#2563eb",
    color: "#fff",
    textAlign: "center",
    padding: "6px 10px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "bold",
    marginBottom: "20px",
    letterSpacing: "1px",
    textTransform: "uppercase",
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