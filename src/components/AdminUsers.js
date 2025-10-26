import React, { useEffect, useState } from "react";
import api from "../api/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

  const loadUsers = () => {
    api.get(`/admin/users?query=${query}&page=0&size=20`)
      .then(res => setUsers(res.data))
      .catch(err => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Management</h2>
      <input
        placeholder="Search user"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={loadUsers}>Search</button>

      <table border="1" cellPadding="6" style={{ marginTop: "10px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Name</th>
            <th>Roles</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.email}</td>
              <td>{u.displayName}</td>
              <td>{u.roles.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
