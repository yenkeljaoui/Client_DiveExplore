import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings = ({ currentUser, setCurrentUser }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      alert('Password must be 8 letters or more');
      return;
    }
    if (!/[A-Z]/.test(newPassword)) {
      alert('Password must contain at least one uppercase letter');
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      alert('Password must contain at least one special symbol');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('The new passwords do not match.');
      return;
    }

    try {
      // const response = await fetch('http://localhost:3001/settings/change-password', {
      const response = await fetch('https://serverdiveexplore.onrender.com/settings/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: currentUser,
          currentPassword,
          newPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // const response = await fetch('http://localhost:3001/settings/delete-account', {
        const response = await fetch('https://serverdiveexplore.onrender.com/settings/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: currentUser }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setCurrentUser(null); // Log out user after account deletion
        navigate('/signin');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Error deleting account');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/signin');
  };

  return (
    <div className="settings-container">
      <div className="settings">
        <h1>Settings</h1>
        
        <div className="setting-item">
          <h2>Change Password</h2>
          <form onSubmit={handlePasswordChange}>
            <label>
              Current Password:
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
              />
            </label>
            <label>
              New Password:
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
              />
            </label>
            <label>
              Confirm New Password:
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
            </label>
            <button type='button' className="show-password-btn" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? 'Hide Passwords' : 'Show Passwords'}
            </button>
            <button type='submit' style={{ marginTop: '20px' }}>Change Password</button> {/* Added margin to separate the buttons */}
          </form>
        </div>

        <div className="setting-item">
          <h2>Delete Account</h2>
          <button onClick={handleDeleteAccount}>Delete My Account</button>
        </div>

        <div className="setting-item">
          <h2>Logout</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>

        <div className="setting-item">
          <button onClick={() => navigate('/')}>Back to Main Page</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
