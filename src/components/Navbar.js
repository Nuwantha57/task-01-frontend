import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("id_token");
    sessionStorage.clear();
    navigate("/login");
  };

  const isAdmin = user?.roles && user.roles.includes("ADMIN");

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/dashboard" className="brand-link">
            <span className="brand-icon"></span>
            <span className="brand-text">Admin Portal</span>
          </Link>
        </div>

        <div className="navbar-menu">
          <Link to="/dashboard" className="nav-link">
            <span className="nav-icon">🏠</span>
            <span>Dashboard</span>
          </Link>

          <Link to="/profile" className="nav-link">
            <span className="nav-icon">👤</span>
            <span>Profile</span>
          </Link>

          {isAdmin && (
            <>
              <Link to="/admin/users" className="nav-link">
                <span className="nav-icon">👥</span>
                <span>Users</span>
              </Link>

              <Link to="/admin/audit-log" className="nav-link">
                <span className="nav-icon">📋</span>
                <span>Audit Logs</span>
              </Link>
            </>
          )}
        </div>

        <div className="navbar-actions">
          {user && (
            <div className="user-info">
              <span className="user-name">{user.displayName}</span>
              <span className="user-role">
                {user.roles && user.roles.length > 0
                  ? user.roles[0]
                  : "User"}
              </span>
            </div>
          )}
          <button onClick={logout} className="btn-logout">
            <span>Logout</span>
            <span className="logout-icon">🚪</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
