import React from "react";

const LoginButton = () => {
  const login = () => {
    const clientId = "65ggmh18gfb0rp0878jrtk9rjg";
    const domain = "eu-north-1exi0aq7ov.auth.eu-north-1.amazoncognito.com";
    const redirectUri = "http://localhost:8080/login/oauth2/code/cognito"; // must match application.properties
    const scopes = "openid email profile";
    const responseType = "code"; // authorization code flow

    const loginUrl = `https://${domain}/login?client_id=${clientId}&response_type=${responseType}&scope=${scopes}&redirect_uri=${redirectUri}`;
    window.location.href = loginUrl;

  };

  return <button onClick={login}>Login with Cognito</button>;
};

export default LoginButton;
