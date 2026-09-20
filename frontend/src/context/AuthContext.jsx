import { useState, useCallback } from "react";
import API from "../services/api";
import { AuthContext } from "./auth";

export default function AuthProvider({ children }) {
  // Restore the session synchronously from localStorage (no effect needed)
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("sms_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("sms_token"));

  // Reload the fresh profile from the server (keeps linkedData in sync)
  const refreshProfile = useCallback(async () => {
    try {
      const res = await API.get("/auth/me");
      const data = res.data.data;
      setUser((prev) => {
        const merged = { ...prev, ...data };
        localStorage.setItem("sms_user", JSON.stringify(merged));
        return merged;
      });
    } catch {
      // Session handled by the 401 interceptor
    }
  }, []);

  // Update harmless account fields (name, mobile, address) locally,
  // then reconcile with the server's /auth/me truth so linkedData
  // stays in sync — same pattern Profile pages use everywhere.
  const updateUser = useCallback(async (patch) => {
    setUser((prev) => {
      const merged = { ...prev, ...patch };
      localStorage.setItem("sms_user", JSON.stringify(merged));
      return merged;
    });
    await refreshProfile();
    return true;
  }, [refreshProfile]);

  const login = async (identifier, password) => {
    const res = await API.post("/auth/login", { identifier, password });
    const data = res.data.data;

    localStorage.setItem("sms_token", data.token);
    localStorage.setItem("sms_user", JSON.stringify(data));

    setToken(data.token);
    setUser(data);

    return data;
  };

  const register = async (payload) => {
    const res = await API.post("/auth/register", payload);
    return res.data;
  };

  const registerAdmin = async (payload) => {
    const res = await API.post("/auth/register-admin", payload);
    return res.data;
  };

  const changePassword = async (payload) => {
    const res = await API.post("/auth/change-password", payload);
    return res.data;
  };

  const logout = async () => {
    // Clear the session synchronously so navigation is immediate
    localStorage.removeItem("sms_token");
    localStorage.removeItem("sms_user");
    setToken(null);
    setUser(null);
    try {
      await API.post("/auth/logout");
    } catch {
      // JWT is stateless — the local session is already cleared
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, registerAdmin, changePassword, updateUser, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}