import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

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


  const logout = () => {
    localStorage.removeItem("id_token");
    sessionStorage.clear();
    navigate("/login");
  };

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!user) {
    return <div className="error-container">Failed to load user data</div>;
  }

  const isAdmin = user.roles && user.roles.includes("ADMIN");

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="nav-brand">
          <h1>Admin Dashboard</h1>
        </div>
        <div className="nav-menu">
          <Link to="/dashboard" className="nav-link active">
            Home
          </Link>
          <Link to="/profile" className="nav-link">
            Profile
          </Link>
          {isAdmin && (
            <>
              <Link to="/admin/users" className="nav-link">
                Users
              </Link>
              <Link to="/admin/audit-log" className="nav-link">
                Audit Logs
              </Link>
            </>
          )}
          <button onClick={logout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

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

      <style>{`
        .dashboard-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: #f5f5f5;
        }

        .navbar {
          background: #2c3e50;
          color: white;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .nav-brand h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
        }

        .nav-menu {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .nav-link {
          color: white;
          text-decoration: none;
          padding: 10px 15px;
          border-radius: 4px;
          transition: background 0.3s;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .nav-link.active {
          /* Increased contrast for accessibility: darker blue provides >=4.5:1 contrast with white text */
          background: #1b4f72;
        }

        /* Improve keyboard focus visibility for links */
        .nav-link:focus,
        .nav-link:focus-visible {
          outline: 2px solid rgba(255,255,255,0.9);
          outline-offset: 2px;
        }

        .btn-logout {
          /* Darker red to ensure sufficient contrast with white text (>=4.5:1) */
          background: #c0392b;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          transition: background 0.15s, transform 0.15s;
        }

        .btn-logout:hover {
          background: #992d22;
          transform: translateY(-1px);
        }

        .btn-logout:focus,
        .btn-logout:focus-visible {
          outline: 2px solid rgba(255,255,255,0.9);
          outline-offset: 2px;
        }

        .dashboard-content {
          flex: 1;
          padding: 30px;
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
        }

        .welcome-card {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }

        .welcome-card h2 {
          margin-top: 0;
          color: #2c3e50;
        }

        .user-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .user-info p {
          margin: 10px 0;
          color: #555;
        }

        .quick-actions {
          margin-top: 30px;
        }

        .quick-actions h3 {
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .action-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .action-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          text-decoration: none;
          color: inherit;
          transition: all 0.3s;
          cursor: pointer;
          border: 2px solid transparent;
        }

        .action-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          border-color: #3498db;
        }

        .card-icon {
          font-size: 40px;
          margin-bottom: 15px;
        }

        .action-card h4 {
          margin: 10px 0 5px 0;
          color: #2c3e50;
        }

        .action-card p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .loading-container,
        .error-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          font-size: 18px;
          font-weight: bold;
        }

        .error-container {
          color: #e74c3c;
        }

        @media (max-width: 768px) {
          .nav-menu {
            flex-direction: column;
            gap: 10px;
            align-items: stretch;
          }

          .navbar {
            flex-direction: column;
            gap: 15px;
          }

          .action-cards {
            grid-template-columns: 1fr;
          }

          .user-info {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;