import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false); // Prevent multiple fetches

  useEffect(() => {
    const fetchUser = async () => {
      // Prevent multiple simultaneous fetches
      if (hasFetched.current) return;
      hasFetched.current = true;

      // Check if token exists
      const token = localStorage.getItem("id_token") || localStorage.getItem("access_token");
      if (!token) {
        console.log("No token found, redirecting to login");
        navigate("/login");
        return;
      }

      console.log("Token found, fetching user data...");

      try {
        const response = await api.get("/me");
        console.log("User data fetched successfully:", response.data);
        setUser(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        console.error("Error response:", err.response);
        
        const status = err.response?.status;
        const errorMessage = err.response?.data?.error || err.message;
        
        console.log("Error status:", status);
        console.log("Error message:", errorMessage);
        
        // Only redirect to login on authentication errors
        if (status === 401 || status === 403) {
          console.log("Authentication failed, clearing tokens and redirecting");
          localStorage.removeItem("id_token");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          navigate("/login");
        } else {
          setError("Failed to load user data: " + errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // Empty dependency array - only run once

  const logout = () => {
    localStorage.removeItem("id_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  if (!user) return <div style={{ padding: '20px' }}>No user data available</div>;

  // Check if user has ADMIN role (roles come as "ROLE_ADMIN" from backend)
  const isAdmin = user.roles && user.roles.some(role => 
    role === "ADMIN" || role === "ROLE_ADMIN" || role.toUpperCase().includes("ADMIN")
  );

  console.log("User roles:", user.roles);
  console.log("Is admin:", isAdmin);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome, {user.displayName}</h1>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Locale:</strong> {user.locale}</p>
      <p><strong>Roles:</strong> {user.roles && user.roles.length > 0 ? user.roles.join(", ") : "None"}</p>
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate("/profile")} style={{ marginRight: '10px' }}>
          Edit Profile
        </button>
        
        {isAdmin && (
          <>
            <button onClick={() => navigate("/admin/users")} style={{ marginRight: '10px' }}>
              Manage Users
            </button>
            <button onClick={() => navigate("/admin/audit-log")} style={{ marginRight: '10px' }}>
              Audit Logs
            </button>
          </>
        )}
        
        <button onClick={logout} style={{ backgroundColor: '#dc3545', color: 'white' }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;