import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "./Navbar";
import "../styles/AdminUsers.css";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [assigning, setAssigning] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchCurrentUser();
    fetchUsers();
  }, [page, pageSize]);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get("/me");
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      navigate("/login");
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/users", {
        params: {
          page: page,
          size: pageSize
        }
      });

      // Handle both paginated and non-paginated responses
      const userData = response.data.content || response.data;
      setUsers(userData);
      setFilteredUsers(userData);
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.email.toLowerCase().includes(query) ||
        user.displayName.toLowerCase().includes(query) ||
        (user.id && user.id.toString().includes(query))
      );
      setFilteredUsers(filtered);
    }
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSelectedRoles(user.roles || []);
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    if (e.target.checked) {
      setSelectedRoles([...selectedRoles, role]);
    } else {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    }
  };

  const handleAssignRoles = async () => {
  if (!selectedUser) {
    setError("No user selected");
    return;
  }

  if (selectedRoles.length === 0) {
    setError("Please select at least one role");
    return;
  }

  try {
    setAssigning(true);
    await api.patch(`/admin/users/${selectedUser.id}/roles`, {
      roles: selectedRoles
    });
    
    // Update the user in both users and filteredUsers arrays
    const updatedUsers = users.map(u =>
      u.id === selectedUser.id ? { ...u, roles: selectedRoles } : u
    );
    
    setUsers(updatedUsers);
    
    // Re-apply search filter to filteredUsers
    const filtered = updatedUsers.filter(u =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.id && u.id.toString().includes(searchQuery.toLowerCase()))
    );
    setFilteredUsers(filtered);

    setSelectedUser(null);
    setSelectedRoles([]);
    setError(null);
    alert("Roles assigned successfully!");
  } catch (err) {
    console.error("Error assigning roles:", err);
    setError(
      err.response?.data?.message || 
      err.response?.data?.error ||
      "Failed to assign roles"
    );
  } finally {
    setAssigning(false);
  }
};

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="admin-users-page">
      {user && <Navbar user={user} />}
      
      <div className="admin-users-container">
        <h2>User Management</h2>

        <div className="search-section">
          <input
            type="text"
            placeholder="Search by email, name, or ID..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className={`content-wrapper ${selectedUser ? 'with-roles' : ''}`}>
          <div className="users-section">
            <h3>Users ({filteredUsers.length})</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Roles</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <tr
                        key={user.id}
                        className={selectedUser?.id === user.id ? "selected" : ""}
                      >
                        <td>{user.id}</td>
                        <td>{user.email}</td>
                        <td>{user.displayName}</td>
                        <td>
                          {user.roles && user.roles.length > 0
                            ? user.roles.join(", ")
                            : "No roles"}
                        </td>
                        <td>
                          <button
                            onClick={() => handleSelectUser(user)}
                            className="btn-select"
                          >
                            {selectedUser?.id === user.id ? "Selected" : "Manage"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-data">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                Previous
              </button>
              <span>Page {page + 1}</span>
              <button onClick={() => setPage(page + 1)}>Next</button>
            </div>
          </div>

          {selectedUser && (
            <div className="roles-section">
              <h3>Assign Roles to {selectedUser.displayName}</h3>
              <div className="roles-list">
                {["ADMIN", "USER", "MANAGER", "VIEWER"].map(role => (
                  <div key={role} className="role-checkbox">
                    <input
                      type="checkbox"
                      id={`role-${role}`}
                      value={role}
                      checked={selectedRoles.includes(role)}
                      onChange={handleRoleChange}
                    />
                    <label htmlFor={`role-${role}`}>{role}</label>
                  </div>
                ))}
              </div>

              <div className="role-actions">
                <button
                  onClick={handleAssignRoles}
                  disabled={assigning}
                  className="btn-assign"
                >
                  {assigning ? "Assigning..." : "Assign Roles"}
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setSelectedRoles([]);
                  }}
                  className="btn-cancel"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;