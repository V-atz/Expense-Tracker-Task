import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Layout from "./Layout.jsx";
import History from "./pages/History.jsx";
import AuthLayout from "./AuthLayout.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import { ExpenseContextProvider } from "./contexts/expenseContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ExpenseContextProvider>
    <Router>
      <Routes>
        {/* protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<App />} />
          <Route path="history" element={<History />} />
        </Route>

        {/* authentication routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Routes>
    </Router>
    </ExpenseContextProvider>
  </StrictMode>
);