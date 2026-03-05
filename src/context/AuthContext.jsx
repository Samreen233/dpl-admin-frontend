import React, { createContext, useContext, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import api, { setAuthToken } from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = () => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setAuthToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear(); // Wipes user, token, and refreshToken
    setAuthToken(null);
    setUser(null);
  };

  // Because this is used as a Route element in App.js
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);