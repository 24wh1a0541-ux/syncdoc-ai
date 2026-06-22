import React, { createContext, useContext, useState, useEffect } from "react";
import { loginRequest, registerRequest, getCurrentUserRequest } from "../services/authAPI";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("syncdoc_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await getCurrentUserRequest();
        setUser(data.user);
      } catch {
        localStorage.removeItem("syncdoc_token");
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    const { data } = await loginRequest({ email, password });
    localStorage.setItem("syncdoc_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (fullName, email, password) => {
    const { data } = await registerRequest({ fullName, email, password });
    localStorage.setItem("syncdoc_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("syncdoc_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
