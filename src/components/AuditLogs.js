import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const AuditLogs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("");
  const [range, setRange] = useState("30");

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (userId) params.userId = userId;
      if (range) params.range = range;

      const response = await api.get("/admin/audit-log", { params });
      setLogs(response.data || []);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
      setError("Failed to load audit logs");
      if (err.response?.status === 403) {
        setError("Access denied. Admin role required.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  if (loading && logs.length === 0) {
    return <div style={{ padding: '20px' }}>Loading audit logs...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Audit Logs</h2>
      
      <button onClick={() => navigate("/dashboard")} style={{ marginBottom: '20px' }}>
        ← Back to Dashboard
      </button>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <form onSubmit={handleFilter} style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>
          User ID:
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Optional"
            style={{ marginLeft: '5px', padding: '5px' }}
          />
        </label>
        <label style={{ marginRight: '10px' }}>
          Days:
          <select 
            value={range} 
            onChange={(e) => setRange(e.target.value)}
            style={{ marginLeft: '5px', padding: '5px' }}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </label>
        <button type="submit">Filter</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Email</th>
            <th>Event Type</th>
            <th>IP Address</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>No audit logs found</td>
            </tr>
          ) : (
            logs.map(log => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.user?.displayName || "N/A"}</td>
                <td>{log.user?.email || "N/A"}</td>
                <td>{log.eventType}</td>
                <td>{log.ipAddress}</td>
                <td>{new Date(log.loginTime).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogs;