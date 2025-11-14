import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "./Navbar";
import "../styles/UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ displayName: "", locale: "", roles: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/me");
      setUser({
        id: response.data.id,
        email: response.data.email,
        displayName: response.data.displayName || "",
        locale: response.data.locale || "en-US",
        roles: response.data.roles || []
      });
      setMessage({ type: "", text: "" });
    } catch (err) {
      console.error("Error fetching profile:", err);
      setMessage({
        type: "error",
        text: "Failed to load profile. Please refresh and try again."
      });
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    if (!user.displayName.trim()) {
      setMessage({ type: "error", text: "Display name cannot be empty" });
      return;
    }

    try {
      setSaving(true);
      await api.patch("/me", {
        displayName: user.displayName.trim(),
        locale: user.locale
      });
      setMessage({
        type: "success",
        text: "Profile updated successfully!"
      });
      
      // Store a flag to indicate profile was updated
      sessionStorage.setItem('profileUpdated', 'true');
      
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update profile"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    fetchUserProfile();
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <Navbar user={user} />
      
      <div className="profile-container">
        <div className="header-section">
          <h2>My Profile</h2>
          <button onClick={handleBackToDashboard} className="btn-back">
            ← Back to Dashboard
          </button>
        </div>

        {message.text && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="profile-card">
          <div className="profile-avatar">
            <span className="avatar-icon">👤</span>
            <p className="avatar-label">User Profile</p>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label htmlFor="email">
                <span className="label-icon">✉️</span>
                Email Address
              </label>
              <div className="readonly-field">{user.email || ""}</div>
              <small>Email cannot be changed</small>
            </div>

            <div className="form-group">
              <label htmlFor="displayName">
                <span className="label-icon">👤</span>
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                name="displayName"
                value={user.displayName}
                onChange={handleInputChange}
                placeholder="Enter your display name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="locale">
                <span className="label-icon">🌍</span>
                Locale / Language
              </label>
              <select
                id="locale"
                name="locale"
                value={user.locale}
                onChange={handleInputChange}
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="de-DE">German</option>
                <option value="fr-FR">French</option>
                <option value="es-ES">Spanish</option>
                <option value="it-IT">Italian</option>
                <option value="pt-BR">Portuguese (Brazil)</option>
                <option value="ja-JP">Japanese</option>
                <option value="zh-CN">Chinese (Simplified)</option>
                <option value="zh-TW">Chinese (Traditional)</option>
              </select>
            </div>

            <div className="form-actions">
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="btn-save"
              >
                {saving ? "Saving..." : "💾 Save Changes"}
              </button>
              <button onClick={handleCancel} disabled={saving} className="btn-cancel-form">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;