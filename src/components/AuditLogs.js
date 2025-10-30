import React, { useEffect, useState } from "react";
import api from "../api/api";

const AuditLogs = () => {
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
    fetchAuditLogs();
  }, [pagination.page]);

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
            Event Type (client-side filter):
            <input
              type="text"
              name="eventType"
              value={filters.eventType}
              onChange={handleFilterChange}
              placeholder="e.g., LOGIN"
            />
          </label>

          <label>
            Date Range:
            <input
              type="text"
              name="range"
              value={filters.range}
              onChange={handleFilterChange}
              placeholder="YYYY-MM-DD_to_YYYY-MM-DD"
            />
            <small style={{ fontSize: '0.8em', color: '#666', marginTop: '3px' }}>
              Format: 2024-01-01_to_2024-01-31
            </small>
          </label>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <button onClick={handleApplyFilters} className="btn-apply">
              Apply Filters
            </button>
            <button onClick={handleReset} className="btn-reset">
              Reset
            </button>
          </div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats">
        <p>Total Records: {pagination.totalElements} | Page {pagination.page + 1} of {pagination.totalPages}</p>
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
                  <td>{log.loginStatus}</td>
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
            className="pagination-btn"
          >
            First
          </button>
          <button 
            onClick={() => handlePageChange(pagination.page - 1)} 
            disabled={pagination.page === 0}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="page-info">
            Page {pagination.page + 1} of {pagination.totalPages}
          </span>
          <button 
            onClick={() => handlePageChange(pagination.page + 1)} 
            disabled={pagination.page >= pagination.totalPages - 1}
            className="pagination-btn"
          >
            Next
          </button>
          <button 
            onClick={() => handlePageChange(pagination.totalPages - 1)} 
            disabled={pagination.page >= pagination.totalPages - 1}
            className="pagination-btn"
          >
            Last
          </button>
        </div>
      )}

      <style>{`
        .audit-logs-container {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
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
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }

        .btn-apply {
          background: #4CAF50;
          color: white;
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

        .stats {
          margin-bottom: 15px;
          font-weight: bold;
          color: #333;
        }

        .table-container {
          overflow-x: auto;
          margin-bottom: 20px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        th {
          background: #2196F3;
          color: white;
          font-weight: bold;
          position: sticky;
          top: 0;
        }

        tbody tr:hover {
          background: #f5f5f5;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-top: 20px;
        }

        .pagination-btn {
          padding: 8px 16px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #2196F3;
          color: white;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-info {
          padding: 0 15px;
          font-weight: bold;
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
          padding: 40px;
          font-size: 18px;
          font-weight: bold;
          color: #2196F3;
        }

        .no-data {
          text-align: center;
          color: #999;
          padding: 30px;
        }
      `}</style>
    </div>
  );
};

export default AuditLogs;