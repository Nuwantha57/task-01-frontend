import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CallbackPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const errorParam = urlParams.get("error");

      if (errorParam) {
        setError(`Authentication error: ${errorParam}`);
        setTimeout(() => navigate("/login"), 3000);
        return;
      }

      if (!code) {
        setError("No authorization code received");
        setTimeout(() => navigate("/login"), 3000);
        return;
      }

      try {
        // Exchange code for tokens
        console.log("Exchanging code for tokens...");
        const response = await axios.post("http://localhost:8080/auth/token", null, {
          params: { code }
        });

        console.log("Token response:", response.data);
        const { id_token, access_token, refresh_token } = response.data;

        // Store tokens
        if (id_token) {
          localStorage.setItem("id_token", id_token);
          console.log("ID token stored");
        }
        if (access_token) {
          localStorage.setItem("access_token", access_token);
          console.log("Access token stored");
        }
        if (refresh_token) {
          localStorage.setItem("refresh_token", refresh_token);
          console.log("Refresh token stored");
        }

        // Redirect to dashboard
        console.log("Redirecting to dashboard...");
        navigate("/dashboard");
      } catch (err) {
        console.error("Token exchange failed:", err);
        console.error("Error response:", err.response?.data);
        setError("Failed to exchange authorization code for tokens");
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {error ? (
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'red' }}>{error}</p>
          <p>Redirecting to login...</p>
        </div>
      ) : (
        <div>Processing authentication...</div>
      )}
    </div>
  );
};

export default CallbackPage;