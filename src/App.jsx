import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Context Providers
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Components
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Users from "./pages/Users";
import Admins from "./pages/Admins";
import UpdatePrice from "./pages/UpdatePrice";
import DailyPrices from "./pages/DailyPrices";
import PriceGraph from "./pages/PriceGraph";
import EditRights from "./pages/EditRights";

// Helper component to redirect logged-in users away from Auth pages (Login/Register)
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : children;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Wrap everything inside AuthProvider as a layout route */}
          <Route element={<AuthProvider />}>
            
            {/* -------- Public Routes (Redirect if already logged in) -------- */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route path="/verify-otp" element={<VerifyOtp />} />

            {/* -------- Protected Routes (Require Authentication) -------- */}
            <Route element={<ProtectedRoute />}>
              {/* Layout provides Sidebar and Main container */}
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/users" element={<Users />} />
                <Route path="/admins" element={<Admins />} />
                <Route path="/admins/edit-rights/:id" element={<EditRights />} />
                <Route path="/update-price" element={<UpdatePrice />} />
                <Route path="/daily-prices" element={<DailyPrices />} />
                <Route path="/price-graph" element={<PriceGraph />} />
              </Route>
            </Route>

            {/* -------- Catch-all -------- */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;