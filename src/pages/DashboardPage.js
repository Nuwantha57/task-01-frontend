import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("id_token")) {
      const params = new URLSearchParams(hash.replace("#", ""));
      const token = params.get("id_token");
      if (token) localStorage.setItem("id_token", token);
      window.location.hash = "";
    }

    api.get("/me")
      .then((res) => setUser(res.data))
      .catch(() => navigate("/login"));
  }, [navigate]);

  const logout = async () => {
    try {
      await api.post("/sessions/logout");
    } catch (e) {
      console.warn("Logout request failed (ignored)", e);
    }
    localStorage.removeItem("id_token");
    navigate("/login");
  };

  if (!user) return <div>Loading user...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome, {user.displayName}</h1>
      <p>Email: {user.email}</p>
      <p>Roles: {user.roles.join(", ")}</p>
      <button onClick={() => navigate("/profile")}>Edit Profile</button>
      {user.roles.includes("ADMIN") && (
        <>
          <button onClick={() => navigate("/admin/users")}>Manage Users</button>
          <button onClick={() => navigate("/admin/audit-log")}>Audit Logs</button>
        </>
      )}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default DashboardPage;
