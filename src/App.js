import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import DiveSpots from './pages/DiveSpots';
import DiveSpotDetails from './pages/DiveSpotDetails';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleSignIn = async (username, password) => {
    try {
      const response = await fetch('http://localhost:3001/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentUser(username); // Set the current user to the username
        return username;
      } else {
        alert(data.message); // Show error message from server
        return null;
      }
    } catch (err) {
      console.error('Error during sign-in:', err);
      alert('Error signing in');
      return null;
    }
  };

  return (
    <div className="App">
      <NavBar isAuthenticated={!!currentUser} />
      <Routes>
        <Route path="/signin" element={<SignIn signin={handleSignIn} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={currentUser ? <Home /> : <Navigate to="/signin" />} />
        <Route path="/about" element={currentUser ? <About /> : <Navigate to="/signin" />} />
        <Route path="/list-of-dives" element={currentUser ? <DiveSpots /> : <Navigate to="/signin" />} />
        <Route path="/dive-spot/:id" element={currentUser ? <DiveSpotDetails /> : <Navigate to="/signin" />} />
        <Route path="/:username" element={currentUser ? <Home /> : <Navigate to="/signin" />} />
      </Routes>
    </div>
  );
}

export default App;

