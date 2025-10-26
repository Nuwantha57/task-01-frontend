import React from "react";

const LoginButton = () => {
  const login = () => {
    const clientId = "65ggmh18gfb0rp0878jrtk9rjg";
    const domain = "eu-north-1exi0aq7ov.auth.eu-north-1.amazoncognito.com";
    const redirectUri = "http://localhost:3000/callback"; // Changed to React app
    const scopes = "openid email profile";
    const responseType = "code"; // authorization code flow

    const loginUrl = `https://${domain}/oauth2/authorize?client_id=${clientId}&response_type=${responseType}&scope=${scopes}&redirect_uri=${redirectUri}`;
    window.location.href = loginUrl;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <button onClick={login} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Login with Cognito
      </button>
    </div>
  );
};

export default LoginButton;