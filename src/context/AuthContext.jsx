import React, { createContext, useContext, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import api, { setAuthToken } from "../api/axios"; // import your axios instance

const AuthContext = createContext();

export const AuthProvider = () => {
  // initialize user from localStorage
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser && storedUser !== "undefined"
        ? JSON.parse(storedUser)
        : null;
    } catch (error) {
      return null;
    }
  });

  // initialize token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token); // set Bearer token in axios headers
    }
  }, []);

  // login function
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
    setAuthToken(token); // attach token to axios headers
  };

  // logout function
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setAuthToken(null); // remove token from axios headers
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Outlet />
    </AuthContext.Provider>
  );
};

// custom hook for easy access
export const useAuth = () => useContext(AuthContext);