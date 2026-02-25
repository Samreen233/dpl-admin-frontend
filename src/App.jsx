import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Context Providers
import { AuthProvider } from "./context/AuthContext";

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
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* --- Public Routes --- */}
            {/* Root page is Login as requested */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* --- Protected Admin Routes --- */}
            {/* These are wrapped in ProtectedRoute and Layout */}
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

            {/* Catch-all: Redirect unknown routes to Login */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
