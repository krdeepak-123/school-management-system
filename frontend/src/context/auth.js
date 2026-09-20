import { createContext, useContext } from "react";

// Shared context object + hook (kept separate from the Provider component)
// so the react-refresh lint rule stays happy.
export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Returns the updateUser updater exposed by the
// provider (mirrors useAuth) — used by role
// Profile pages to persist edited account fields.
export const useAuthUpdate = () => useContext(AuthContext)?.updateUser || (async () => {});
