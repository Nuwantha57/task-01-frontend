import React from "react";
import "../styles/Login.css";

const LoginPage = () => {
  const handleLogin = () => {
    const domain = "eu-north-1exi0aq7ov.auth.eu-north-1.amazoncognito.com";
    const clientId = "65ggmh18gfb0rp0878jrtk9rjg";
    const redirectUri = "http://localhost:3000/dashboard";
    const responseType = "token";
    const scope = "openid+email+profile";

    const loginUrl = `https://${domain}/login?client_id=${clientId}&response_type=${responseType}&scope=${scope}&redirect_uri=${redirectUri}`;
    window.location.href = loginUrl;
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-logo">⚡</div>
        <h1 className="login-title">Admin Portal</h1>
        <p className="login-subtitle">
          Secure access to your administration dashboard
        </p>

        <button id="loginBtn" onClick={handleLogin} className="login-btn">
          <span className="login-icon">🔐</span>
          <span>Login with AWS Cognito</span>
        </button>

        <div className="login-features">
          <h3>Secure & Powerful</h3>
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Secure authentication with AWS Cognito</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Role-based access control</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Comprehensive audit logging</span>
            </div>
          </div>
        </div>

        <div className="login-footer">
          © 2025 Admin Portal. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
