import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth";

// Requires an authenticated user
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Requires an authenticated user AND one of the given roles
export function RoleRoute({ roles, children, fallback = "/unauthorized" }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to={fallback} replace />;
  }

  return children;
}