import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UserProfile from "./components/UserProfile";
import AdminUsers from "./components/AdminUsers";
import AuditLogs from "./components/AuditLogs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/audit-log" element={<AuditLogs />} />
      </Routes>
    </Router>
  );
}

export default App;
