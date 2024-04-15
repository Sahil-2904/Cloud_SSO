// App.js

import React, { useEffect, useState } from 'react';

function App() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Extract token from URL query params
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      // Set token in state
      setToken(token);
      // Remove token from URL
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  const handleLogin = () => {
    // Redirect to backend for Google OAuth2 authentication
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className="App">
      {!token ? (
        <button onClick={handleLogin}>Sign in with Google</button>
      ) : (
        <div>
          <h1>Successfully authenticated!</h1>
          <p>Token: {token}</p>
        </div>
      )}
    </div>
  );
}

export default App;
