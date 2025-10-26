import React, { useEffect, useState } from "react";
import api from "../api/api";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [userId, setUserId] = useState("");
  const [range, setRange] = useState("");

  const loadLogs = () => {
    const query = `?user_id=${userId || ""}&range=${range || ""}`;
    api.get(`/admin/audit-log${query}`)
      .then(res => setLogs(res.data))
      .catch(err => console.error("Error fetching logs:", err));
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Audit Logs</h2>
      <div>
        <input
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          placeholder="Date range"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        />
        <button onClick={loadLogs}>Filter</button>
      </div>

      <table border="1" cellPadding="6" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th>User</th>
            <th>Event</th>
            <th>IP</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td>{log.user?.displayName}</td>
              <td>{log.eventType}</td>
              <td>{log.ipAddress}</td>
              <td>{new Date(log.loginTime).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogs;
