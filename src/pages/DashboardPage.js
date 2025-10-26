import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Extract id_token from URL
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.replace("#", ""));
      const id_token = params.get("id_token");
      if (id_token) localStorage.setItem("id_token", id_token);
      window.location.hash = "";
    }

    // Fetch user info from backend
    api.get("/me")
      .then(res => setUser(res.data))
      .catch(() => navigate("/login"));
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("id_token");
    window.location.href = "/login";
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user.displayName}</h1>
      <p>Email: {user.email}</p>
      <p>Roles: {user.roles.join(", ")}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default DashboardPage;
