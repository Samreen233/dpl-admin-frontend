import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SuperAdminRoute = () => {
  const { user } = useAuth();

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If not superadmin, redirect to dashboard
  if (user.role_name !== "superadmin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Render nested routes
  return <Outlet />;
};

export default SuperAdminRoute;
