import React, { useEffect, useState } from "react";
import api from "../api/api";

const UserProfile = () => {
  const [user, setUser] = useState({ displayName: "", locale: "" });

  useEffect(() => {
    api.get("/me").then((res) => setUser(res.data));
  }, []);

  const handleUpdate = () => {
    api.patch("/me", user)
      .then(() => alert("Profile updated successfully"))
      .catch((err) => console.error(err));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Profile</h2>
      <div>
        <label>Name:</label>
        <input
          value={user.displayName}
          onChange={(e) => setUser({ ...user, displayName: e.target.value })}
        />
      </div>
      <div>
        <label>Locale:</label>
        <input
          value={user.locale}
          onChange={(e) => setUser({ ...user, locale: e.target.value })}
        />
      </div>
      <button onClick={handleUpdate}>Save</button>
    </div>
  );
};

export default UserProfile;
