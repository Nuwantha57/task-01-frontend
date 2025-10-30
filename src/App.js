import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginButton from "./components/LoginButton";
import CallbackPage from "./pages/CallbackPage";
import DashboardPage from "./pages/DashboardPage";
import AdminUsers from "./components/AdminUsers";
import AuditLogs from "./components/AuditLogs";
import UserProfile from "./components/UserProfile";
import TokenDebug from "./pages/TokenDebug";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginButton />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/audit-log" element={<AuditLogs />} />
        <Route path="/debug" element={<TokenDebug />} />
        <Route path="*" element={<LoginButton />} />
      </Routes>
    </Router>
  );
}

export default App;