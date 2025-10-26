import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ displayName: "", locale: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/me");
        setUser({
          displayName: response.data.displayName || "",
          locale: response.data.locale || ""
        });
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      await api.patch("/me", { 
        displayName: user.displayName, 
        locale: user.locale 
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError("Failed to update profile: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading profile...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Edit Profile</h2>
      
      <button onClick={() => navigate("/dashboard")} style={{ marginBottom: '20px' }}>
        ← Back to Dashboard
      </button>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '10px' }}>Profile updated successfully!</div>}

      <form onSubmit={handleUpdate}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            <strong>Display Name:</strong>
          </label>
          <input
            type="text"
            value={user.displayName}
            onChange={e => setUser({ ...user, displayName: e.target.value })}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            <strong>Locale:</strong>
          </label>
          <select
            value={user.locale}
            onChange={e => setUser({ ...user, locale: e.target.value })}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="es-ES">Spanish</option>
            <option value="fr-FR">French</option>
            <option value="de-DE">German</option>
            <option value="ja-JP">Japanese</option>
            <option value="zh-CN">Chinese (Simplified)</option>
          </select>
        </div>

        <button type="submit" style={{ padding: '10px 20px' }}>
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfile;