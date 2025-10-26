import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginButton from "./components/LoginButton";
import DashboardPage from "./pages/DashboardPage";
import AdminUsers from "./components/AdminUsers";
import AuditLogs from "./components/AuditLogs";
import UserProfile from "./components/UserProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginButton />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/audit-log" element={<AuditLogs />} />
        <Route path="*" element={<LoginButton />} />
      </Routes>
    </Router>
  );
}

export default App;
