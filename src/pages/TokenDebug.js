import React, { useState } from "react";
import axios from "axios";

const TokenDebug = () => {
  const [tokenInfo, setTokenInfo] = useState(null);
  const [backendResponse, setBackendResponse] = useState(null);

  const decodeToken = (token) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return { error: "Invalid token format" };
      
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch (e) {
      return { error: "Failed to decode token: " + e.message };
    }
  };

  const checkToken = async () => {
    const idToken = localStorage.getItem("id_token");
    const accessToken = localStorage.getItem("access_token");

    const info = {
      hasIdToken: !!idToken,
      hasAccessToken: !!accessToken,
      idTokenDecoded: idToken ? decodeToken(idToken) : null,
      accessTokenDecoded: accessToken ? decodeToken(accessToken) : null,
      idTokenRaw: idToken ? idToken.substring(0, 50) + "..." : null,
    };

    setTokenInfo(info);

    // Test backend
    try {
      const response = await axios.get("http://localhost:8080/api/v1/token-debug", {
        headers: {
          Authorization: `Bearer ${idToken || accessToken}`
        }
      });
      setBackendResponse({ success: true, data: response.data });
    } catch (error) {
      setBackendResponse({ 
        success: false, 
        error: error.message,
        status: error.response?.status,
        data: error.response?.data 
      });
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Token Debug Tool</h2>
      <button onClick={checkToken} style={{ padding: '10px 20px', marginBottom: '20px' }}>
        Check Tokens
      </button>

      {tokenInfo && (
        <div>
          <h3>Local Storage Tokens:</h3>
          <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
            {JSON.stringify(tokenInfo, null, 2)}
          </pre>
        </div>
      )}

      {backendResponse && (
        <div>
          <h3>Backend Response:</h3>
          <pre style={{ 
            background: backendResponse.success ? '#d4edda' : '#f8d7da', 
            padding: '10px', 
            overflow: 'auto' 
          }}>
            {JSON.stringify(backendResponse, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Actions:</h3>
        <button 
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
          style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white' }}
        >
          Clear All Tokens & Logout
        </button>
      </div>
    </div>
  );
};

export default TokenDebug;