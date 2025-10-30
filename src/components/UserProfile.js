import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ displayName: "", locale: "" });
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
        locale: response.data.locale || "en-US"
      });
      setMessage({ type: "", text: "" });
    } catch (err) {
      console.error("Error fetching profile:", err);
      setMessage({
        type: "error",
        text: "Failed to load profile. Please refresh and try again."
      });
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

      <div className="profile-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={user.email || ""}
            disabled
            className="disabled-input"
          />
          <small>Email cannot be changed</small>
        </div>

        <div className="form-group">
          <label htmlFor="displayName">Display Name:</label>
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
          <label htmlFor="locale">Locale:</label>
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

        <div className="button-group">
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>
          <button onClick={handleCancel} disabled={saving} className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>

      <style>{`
        .profile-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
        }

        .header-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .header-section h2 {
          margin: 0;
        }

        .btn-back {
          background: #6c757d;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.3s;
        }

        .btn-back:hover {
          background: #5a6268;
        }

        .profile-form {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-weight: bold;
          margin-bottom: 8px;
          color: #333;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 14px;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #4CAF50;
          box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
        }

        .disabled-input {
          background: #e8e8e8;
          cursor: not-allowed;
        }

        .form-group small {
          display: block;
          color: #666;
          font-size: 12px;
          margin-top: 5px;
        }

        .button-group {
          display: flex;
          gap: 10px;
          margin-top: 25px;
        }

        .btn-primary,
        .btn-secondary {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-primary {
          background: #4CAF50;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #45a049;
        }

        .btn-primary:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: #f0f0f0;
          color: #333;
          border: 1px solid #ddd;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #e0e0e0;
        }

        .btn-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .message {
          padding: 12px 16px;
          margin-bottom: 20px;
          border-radius: 4px;
          font-weight: 500;
        }

        .message-success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .message-error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .loading {
          text-align: center;
          padding: 20px;
          font-weight: bold;
        }

        @media (max-width: 600px) {
          .header-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default UserProfile;