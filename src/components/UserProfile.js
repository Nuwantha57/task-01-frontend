import React, { useEffect, useState } from "react";
import api from "../api/api";

const UserProfile = () => {
  const [user, setUser] = useState({ displayName: "", locale: "" });

  useEffect(() => {
    api.get("/me")
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleUpdate = () => {
    api.patch("/me", { displayName: user.displayName, locale: user.locale })
      .then(res => alert("Profile updated"))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Profile</h2>
      <label>Name:</label>
      <input
        value={user.displayName}
        onChange={e => setUser({ ...user, displayName: e.target.value })}
      />
      <label>Locale:</label>
      <input
        value={user.locale}
        onChange={e => setUser({ ...user, locale: e.target.value })}
      />
      <button onClick={handleUpdate}>Update</button>
    </div>
  );
};

export default UserProfile;
