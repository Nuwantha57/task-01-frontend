import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "./Navbar";
import "../styles/AuditLogs.css";

const AuditLogs = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalPages: 0,
    totalElements: 0
  });
  const [filters, setFilters] = useState({
    userId: "",
    eventType: "",
    range: ""
  });

  useEffect(() => {
    fetchCurrentUser();
    fetchAuditLogs();
  }, [pagination.page]);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/me");
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      navigate("/login");
    }
  };

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        size: pagination.size
      };
      
      if (filters.userId) params.user_id = filters.userId;
      if (filters.range) params.range = filters.range;
      
      const response = await api.get("/admin/audit-log", { params });
      
      console.log("API Response:", response.data);
      
      // Handle ApiResponse wrapper
      if (response.data && response.data.data) {
        const pageData = response.data.data;
        const logsData = Array.isArray(pageData.content) ? pageData.content : [];
        
        setLogs(logsData);
        setPagination(prev => ({
          ...prev,
          totalPages: pageData.totalPages || 0,
          totalElements: pageData.totalElements || 0
        }));
        applyFilters(logsData);
        setError(null);
      } else {
        setLogs([]);
        setFilteredLogs([]);
        setError("Unexpected response format");
      }
    } catch (err) {
      console.error("Error fetching audit logs:", err);
      setError(err.response?.data?.message || "Failed to fetch audit logs");
      setLogs([]);
      setFilteredLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data) => {
    if (!Array.isArray(data)) {
      console.error("applyFilters received non-array data:", data);
      setFilteredLogs([]);
      return;
    }

    let filtered = [...data];

    // Client-side filtering for eventType (since backend doesn't support it)
    if (filters.eventType) {
      filtered = filtered.filter(log =>
        log.loginStatus?.toLowerCase().includes(filters.eventType.toLowerCase())
      );
    }

    setFilteredLogs(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = () => {
    setPagination(prev => ({ ...prev, page: 0 }));
    fetchAuditLogs();
  };

  const handleReset = () => {
    setFilters({
      userId: "",
      eventType: "",
      range: ""
    });
    setPagination(prev => ({ ...prev, page: 0 }));
    setTimeout(() => fetchAuditLogs(), 0);
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (loading) return <div className="loading">Loading audit logs...</div>;

  return (
    <div className="audit-logs-page">
      {user && <Navbar user={user} />}
      
      <div className="audit-logs-container">
        <h2>Audit Logs</h2>

        <div className="filters-section">
          <h3>Filters</h3>
          <div className="filters-grid">
            <div className="filter-group">
              <label htmlFor="userId">User ID</label>
              <input
                id="userId"
                type="text"
                name="userId"
                value={filters.userId}
                onChange={handleFilterChange}
                placeholder="Enter user ID"
              />
            </div>

            <div className="filter-group">
              <label htmlFor="eventType">Event Type</label>
              <input
                id="eventType"
                type="text"
                name="eventType"
                value={filters.eventType}
                onChange={handleFilterChange}
                placeholder="e.g., LOGIN"
              />
              <small>Client-side filter</small>
            </div>

            <div className="filter-group">
              <label htmlFor="range">Date Range</label>
              <input
                id="range"
                type="text"
                name="range"
                value={filters.range}
                onChange={handleFilterChange}
                placeholder="YYYY-MM-DD_to_YYYY-MM-DD"
              />
              <small>Format: 2024-01-01_to_2024-01-31</small>
            </div>
          </div>

          <div className="filter-actions">
            <button onClick={handleApplyFilters} className="btn-apply-filter">
              Apply Filters
            </button>
            <button onClick={handleReset} className="btn-reset-filter">
              Reset
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="logs-section">
          <div className="logs-header">
            <h3>Audit Log Records</h3>
            <span className="logs-count">
              Total: {pagination.totalElements} | Page {pagination.page + 1} of {pagination.totalPages}
            </span>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Email</th>
                  <th>Event Status</th>
                  <th>Login Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map(log => (
                    <tr key={log.id}>
                      <td>{log.id}</td>
                      <td>{log.userId}</td>
                      <td>{log.userEmail || "N/A"}</td>
                      <td>
                        <span className={`status-badge ${log.loginStatus === 'SUCCESS' ? 'status-success' : 'status-failed'}`}>
                          {log.loginStatus}
                        </span>
                      </td>
                      <td>{new Date(log.loginTime).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">
                      No audit logs found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(0)} 
                disabled={pagination.page === 0}
              >
                First
              </button>
              <button 
                onClick={() => handlePageChange(pagination.page - 1)} 
                disabled={pagination.page === 0}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {pagination.page + 1} of {pagination.totalPages}
              </span>
              <button 
                onClick={() => handlePageChange(pagination.page + 1)} 
                disabled={pagination.page >= pagination.totalPages - 1}
              >
                Next
              </button>
              <button 
                onClick={() => handlePageChange(pagination.totalPages - 1)} 
                disabled={pagination.page >= pagination.totalPages - 1}
              >
                Last
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;