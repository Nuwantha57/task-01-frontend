import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRoles, setNewRoles] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/admin/users", {
        params: { query, page, size: 10 }
      });
      
      // Backend returns Page<AppUser>
      if (response.data.content) {
        setUsers(response.data.content);
        setTotalPages(response.data.totalPages);
      } else if (Array.isArray(response.data)) {
        // Fallback if backend returns array
        setUsers(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users");
      if (err.response?.status === 403) {
        setError("Access denied. Admin role required.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, query]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchUsers();
  };

  const handleAssignRoles = async (userId) => {
    if (!newRoles.trim()) {
      alert("Please enter roles");
      return;
    }

    try {
      const roleArray = newRoles.split(",").map(r => r.trim()).filter(r => r);
      await api.patch(`/admin/users/${userId}/roles`, roleArray);
      alert("Roles assigned successfully");
      setSelectedUser(null);
      setNewRoles("");
      fetchUsers();
    } catch (err) {
      console.error("Failed to assign roles:", err);
      alert("Failed to assign roles: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading && users.length === 0) {
    return <div style={{ padding: '20px' }}>Loading users...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>User Management</h2>
      
      <button onClick={() => navigate("/dashboard")} style={{ marginBottom: '20px' }}>
        ← Back to Dashboard
      </button>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: '5px', marginRight: '10px', width: '300px' }}
        />
        <button type="submit">Search</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Display Name</th>
            <th>Locale</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No users found</td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.displayName}</td>
                <td>{user.locale}</td>
                <td>
                  <button onClick={() => setSelectedUser(user)} style={{ fontSize: '12px' }}>
                    Assign Roles
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
            Previous
          </button>
          <span style={{ margin: '0 10px' }}>Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
            Next
          </button>
        </div>
      )}

      {selectedUser && (
        <div style={{ 
          position: 'fixed', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          border: '1px solid #ccc',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          <h3>Assign Roles to {selectedUser.displayName}</h3>
          <p>Enter roles separated by commas (e.g., ADMIN, USER, MANAGER)</p>
          <input
            type="text"
            value={newRoles}
            onChange={(e) => setNewRoles(e.target.value)}
            placeholder="ADMIN, USER"
            style={{ width: '100%', padding: '5px', marginBottom: '10px' }}
          />
          <div>
            <button onClick={() => handleAssignRoles(selectedUser.id)} style={{ marginRight: '10px' }}>
              Assign
            </button>
            <button onClick={() => { setSelectedUser(null); setNewRoles(""); }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 999
        }} onClick={() => { setSelectedUser(null); setNewRoles(""); }} />
      )}
    </div>
  );
};

export default AdminUsers;