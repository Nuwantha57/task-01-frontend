import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetchUserData must be declared before useEffect hooks that reference it
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/me");
      console.log('Fetched user data:', response.data);
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    // Extract id_token from URL hash
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.replace("#", ""));
      const id_token = params.get("id_token");
      if (id_token) localStorage.setItem("id_token", id_token);
      window.location.hash = "";
    }

    // Fetch user info from backend
    fetchUserData();
  }, [fetchUserData]);

  // Add visibility change listener to refetch when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Check if profile was updated
        if (sessionStorage.getItem('profileUpdated') === 'true') {
          console.log('Profile was updated, refreshing user data...');
          fetchUserData();
          sessionStorage.removeItem('profileUpdated');
        }
      }
    };

    // Also check when component mounts/updates
    if (sessionStorage.getItem('profileUpdated') === 'true') {
      console.log('Profile was updated, refreshing user data...');
      fetchUserData();
      sessionStorage.removeItem('profileUpdated');
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [fetchUserData]);


  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!user) {
    return <div className="error-container">Failed to load user data</div>;
  }

  const isAdmin = user.roles && user.roles.includes("ADMIN");

  return (
    <div className="dashboard-container">
      <Navbar user={user} />

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome, {user.displayName}!</h2>
          <div className="user-info">
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Roles:</strong>{" "}
              {user.roles && user.roles.length > 0
                ? user.roles.join(", ")
                : "No roles assigned"}
            </p>
            <p>
              <strong>Locale:</strong> {user.locale}
            </p>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-cards">
            <Link to="/profile" className="action-card">
              <div className="card-icon">👤</div>
              <h4>Edit Profile</h4>
              <p>Update your name and preferences</p>
            </Link>

            {isAdmin && (
              <>
                <Link to="/admin/users" className="action-card">
                  <div className="card-icon">👥</div>
                  <h4>Manage Users</h4>
                  <p>View and manage system users</p>
                </Link>

                <Link to="/admin/audit-log" className="action-card">
                  <div className="card-icon">📋</div>
                  <h4>Audit Logs</h4>
                  <p>View system activity logs</p>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;