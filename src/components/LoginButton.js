import React from "react";

const LoginButton = () => {
  const login = () => {
    const domain = "eu-north-1exi0aq7ov.auth.eu-north-1.amazoncognito.com";
    const clientId = "65ggmh18gfb0rp0878jrtk9rjg";
    const redirectUri = "http://localhost:3000/dashboard";
    const responseType = "token";
    const scope = "openid email profile";

    const loginUrl = `https://${domain}/login?client_id=${clientId}&response_type=${responseType}&scope=${scope}&redirect_uri=${redirectUri}`;
    window.location.href = loginUrl;


  };

  return <button onClick={login}>Login with Cognito</button>;
};

export default LoginButton;
