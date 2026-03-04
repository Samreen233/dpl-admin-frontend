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
import VerifyOtp from "./pages/VerifyOtp";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Users from "./pages/Users";
import Admins from "./pages/Admins";
import UpdatePrice from "./pages/UpdatePrice";
import DailyPrices from "./pages/DailyPrices";
import PriceGraph from "./pages/PriceGraph";
import EditRights from "./pages/EditRights";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Wrap everything inside AuthProvider */}
          <Route element={<AuthProvider />}>
            
            {/* -------- Public Routes -------- */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />

            {/* -------- Protected Routes -------- */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/users" element={<Users />} />
                <Route path="/admins" element={<Admins />} />
                <Route
                  path="/admins/edit-rights/:id"
                  element={<EditRights />}
                />
                <Route path="/update-price" element={<UpdatePrice />} />
                <Route path="/daily-prices" element={<DailyPrices />} />
                <Route path="/price-graph" element={<PriceGraph />} />

              </Route>
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;