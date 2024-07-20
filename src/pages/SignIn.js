// src/pages/SignIn.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignIn.css'; // Ajoutez ce fichier CSS pour le style

function SignIn(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = () => {
    const user = props.signin(username, password);
    if (user) {
      navigate('/');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSignIn();
    }
  };

  return (
    <div className="signin-container">
      <h1 className="signin-title">DiveExplore</h1>
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
          type={showPassword ? 'text' : 'password'}
          className="signin-input"
          onKeyPress={handleKeyPress}
        />
        <label className="show-password-label">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          Show Password
        </label>
      </div>
      <button onClick={handleSignIn} className="signin-button">
        Enter
      </button>
      <div className="signup-link">
        <span>Don't have an account?</span>
        <Link to="/signup">
          <button className="signup-button-link">Sign Up</button>
        </Link>
      </div>
    </div>
  );
}

export default SignIn;
