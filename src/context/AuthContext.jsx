import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { Outlet, useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../api/axios";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = () => {
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

  const navigate = useNavigate();
  const refreshTimeoutRef = useRef(null);

  // Restore access token from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    } else {
      // Prevent entering protected routes with stale user data and no token.
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  // Proactively refresh access token before it expires
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user) return;

    // Decode JWT to get expiration time
    const decodeToken = (token) => {
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join(""),
        );
        return JSON.parse(jsonPayload);
      } catch (e) {
        return null;
      }
    };

    const decoded = decodeToken(token);
    if (!decoded?.exp) return;

    const expiresIn = decoded.exp * 1000 - Date.now(); // Convert to ms
    const refreshTime = expiresIn - 60000; // Refresh 1 minute before expiry

    if (refreshTime > 0) {
      refreshTimeoutRef.current = setTimeout(async () => {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/auth/refresh`,
            {},
            { withCredentials: true },
          );

          const newAccessToken = res.data.accessToken;
          localStorage.setItem("token", newAccessToken);
          setAuthToken(newAccessToken);
        } catch (err) {
          console.error("Token refresh failed:", err);
          logout();
          navigate("/");
        }
      }, refreshTime);
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [user, navigate]);

  const login = (userData, accessToken) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", accessToken);
    setAuthToken(accessToken);
    setUser(userData);
  };

  const logout = () => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
