// src/pages/SignIn.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css'; // Ajoutez ce fichier CSS pour le style

function SignIn(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = () => {
    const user = props.signin(username, password);
    if (user) {
      navigate('/');
    }
  };

  return (
    <div className="signin-container">
      <h1>DiveExplore</h1>
      <div className="signin-form">
        <input
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          placeholder="Username"
          type="text"
          className="signin-input"
        />
        <input
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          placeholder="Password"
          type="password"
          className="signin-input"
        />
      </div>
      <button onClick={handleSignIn} className="signin-button">
        Enter
      </button>
    </div>
  );
}

export default SignIn;
