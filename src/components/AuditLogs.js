import React, { useEffect, useState } from "react";
import api from "../api/api";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    userId: "",
    eventType: "",
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filters.userId) params.userId = filters.userId;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      
      const response = await api.get("/admin/audit-log", { params });
      setLogs(response.data);
      applyFilters(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching audit logs:", err);
      setError("Failed to fetch audit logs");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data) => {
    let filtered = data;

    if (filters.eventType) {
      filtered = filtered.filter(log =>
        log.eventType.toLowerCase().includes(filters.eventType.toLowerCase())
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
    applyFilters(logs);
  };

  const handleReset = () => {
    setFilters({
      userId: "",
      eventType: "",
      startDate: "",
      endDate: ""
    });
    setFilteredLogs(logs);
  };

  if (loading) return <div className="loading">Loading audit logs...</div>;

  return (
    <div className="audit-logs-container">
      <h2>Audit Logs</h2>

      <div className="filters-section">
        <h3>Filters</h3>
        <div className="filter-group">
          <label>
            User ID:
            <input
              type="text"
              name="userId"
              value={filters.userId}
              onChange={handleFilterChange}
              placeholder="Enter user ID"
            />
          </label>

          <label>
            Event Type:
            <input
              type="text"
              name="eventType"
              value={filters.eventType}
              onChange={handleFilterChange}
              placeholder="e.g., LOGIN"
            />
          </label>

          <label>
            Start Date:
            <input
              type="datetime-local"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </label>

          <label>
            End Date:
            <input
              type="datetime-local"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </label>

          <button onClick={handleApplyFilters} className="btn-apply">
            Apply Filters
          </button>
          <button onClick={handleReset} className="btn-reset">
            Reset
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Event</th>
              <th>IP Address</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map(log => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.user?.displayName || "N/A"}</td>
                  <td>{log.eventType}</td>
                  <td>{log.ipAddress}</td>
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

      <style>{`
        .audit-logs-container {
          padding: 20px;
        }

        .filters-section {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }

        .filter-group {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
          margin-top: 10px;
        }

        .filter-group label {
          display: flex;
          flex-direction: column;
          font-weight: bold;
        }

        .filter-group input {
          padding: 8px;
          margin-top: 5px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .btn-apply, .btn-reset {
          padding: 8px 15px;
          margin-top: 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }

        .btn-apply {
          background: #4CAF50;
          color: white;
          margin-right: 10px;
        }

        .btn-apply:hover {
          background: #45a049;
        }

        .btn-reset {
          background: #f44336;
          color: white;
        }

        .btn-reset:hover {
          background: #da190b;
        }

        .table-container {
          overflow-x: auto;
        }

        .error-message {
          color: #d32f2f;
          padding: 10px;
          background: #ffebee;
          border-radius: 4px;
          margin-bottom: 15px;
        }

        .loading {
          text-align: center;
          padding: 20px;
          font-weight: bold;
        }

        .no-data {
          text-align: center;
          color: #999;
        }
      `}</style>
    </div>
  );
};

export default AuditLogs;