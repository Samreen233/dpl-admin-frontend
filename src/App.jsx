import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

// Components
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Users from "./pages/Users";
import Admins from "./pages/Admins";
import UpdatePrice from "./pages/UpdatePrice";
import DailyPrices from "./pages/DailyPrices";
import PriceGraph from "./pages/PriceGraph";
import EditRights from "./pages/EditRights"; // Import the new page

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* --- Protected Admin Routes --- */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Products />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Users />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admins"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Admins />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Route for editing rights of a specific admin via ID */}
            <Route
              path="/admins/edit-rights/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <EditRights />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Optional: Route for the Sidebar 'Permissions' link (defaults to admin list or specific view) */}
            <Route
              path="/admins/edit-rights"
              element={<Navigate to="/admins" replace />}
            />

            <Route
              path="/update-price"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UpdatePrice />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/daily-prices"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DailyPrices />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/price-graph"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PriceGraph />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Catch-all: Redirect unknown routes to Login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;