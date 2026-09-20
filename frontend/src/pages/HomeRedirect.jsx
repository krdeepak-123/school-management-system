import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth";

const DESTINATIONS = {
  student: "/student-dashboard",
  teacher: "/teacher-dashboard",
  principal: "/principal/dashboard",
  director: "/director/dashboard",
  admin: "/admin/dashboard",
};

// Sends the user to their role-specific dashboard
export default function HomeRedirect() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={DESTINATIONS[user.role] || "/dashboard"} replace />;
}