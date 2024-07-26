import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignUp.css'; // Add this CSS file for styling

export default function SignUp(props) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!username.trim()) {
      alert('Username must contain at least one value');
      return;
    }
    if (email.length < 5 || email.length > 50) {
      alert('Email must be between 5 and 50 characters long');
      return;
    }
    if (!/@/.test(email)) {
      alert('Email must contain an "@" symbol');
      return;
    }
    if (password.length < 8) {
      alert('Password must be 8 letters or more');
      return;
    }
    if (!/[A-Z]/.test(password)) {
      alert('Password must contain at least one uppercase letter');
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      alert('Password must contain at least one special symbol');
      return;
    }
    if (password !== confirmPassword) {
      alert('The passwords do not match');
      return;
    }

    const newUser = {
      username,
      email,
      password,
    };

    try {
      // const response = await fetch('https://serverdiveexplore-1.onrender.com/signup', {
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        // const result = await response.json();
        alert('Signup successful!');
        // props.addUser(newUser);
        navigate('/signin');
      } else {
        const error = await response.json();
        alert(`Signup failed: ${error.message}`);
      }
    } catch (error) {
      alert(`Signup failed: ${error.message}`);
    }
  };

  return (
    <div className="signup-container">
      <h1 className="signup-title">DiveExplore</h1>
      <div className="signup-form">
        <input
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          placeholder="Username"
          type="text"
          className="signup-input"
        />
        <input
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          placeholder="Email"
          type="text"
          className="signup-input"
        />
        <input
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          placeholder="Password"
          type={showPassword ? 'text' : 'password'}
          className="signup-input"
        />
        <input
          value={confirmPassword}
          onChange={(ev) => setConfirmPassword(ev.target.value)}
          placeholder="Confirm password"
          type={showPassword ? 'text' : 'password'}
          className="signup-input"
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
      <button onClick={handleSignUp} className="signup-button">
        Send
      </button>
      <div className="signin-link">
        <span>Already have an account?</span>
        <Link to="/signin">
          <button className="signin-button-link">Sign In</button>
        </Link>
      </div>
    </div>
  );
}
