import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import DiveSpots from './pages/DiveSpots';
import DiveSpotDetails from './pages/DiveSpotDetails';

const initialUsers = [
  { username: 'yenkel', password: 'Yenkel@23' }
];

function App() {
  const [users, setUsers] = useState(initialUsers);
  const [currentUser, setCurrentUser] = useState(null);
  const [diveSpots, setDiveSpots] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/dive-spots')
      .then((response) => response.json())
      .then((data) => setDiveSpots(data))
      .catch((error) => console.error('Error fetching diving spots:', error));
  }, []);

  const addUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  const signin = (username, password) => {
    const existingUser = users.find((user) => user.username === username && user.password === password);
    if (!existingUser) {
      alert('User not found');
      return null;
    } else {
      setCurrentUser(existingUser);
      return existingUser.username;
    }
  };

  const addPhoto = (spotId, photoDataUrl) => {
    const formData = new FormData();
    formData.append('photo', photoDataUrl);

    fetch(`http://localhost:3001/dive-spots/${spotId}/photo`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setDiveSpots((prevSpots) =>
          prevSpots.map((spot) => (spot.id === spotId ? { ...spot, images: [...spot.images, data.photoUrl] } : spot))
        );
      })
      .catch((error) => console.error('Error adding photo:', error));
  };

  const addFish = (spotId, fishName) => {
    fetch(`http://localhost:3001/dive-spots/${spotId}/fish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fishName })
    })
      .then((response) => response.json())
      .then((data) => {
        setDiveSpots((prevSpots) =>
          prevSpots.map((spot) => (spot.id === spotId ? { ...spot, fish: data } : spot))
        );
      })
      .catch((error) => console.error('Error adding fish:', error));
  };

  const likeSpot = (spotId) => {
    fetch(`http://localhost:3001/dive-spots/${spotId}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: currentUser.username })
    })
      .then((response) => response.json())
      .then((data) => {
        setDiveSpots((prevSpots) =>
          prevSpots.map((spot) => (spot.id === spotId ? { ...spot, likes: data.likes, dislikes: data.dislikes } : spot))
        );
      })
      .catch((error) => console.error('Error liking spot:', error));
  };

  const dislikeSpot = (spotId) => {
    fetch(`http://localhost:3001/dive-spots/${spotId}/dislike`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: currentUser.username })
    })
      .then((response) => response.json())
      .then((data) => {
        setDiveSpots((prevSpots) =>
          prevSpots.map((spot) => (spot.id === spotId ? { ...spot, likes: data.likes, dislikes: data.dislikes } : spot))
        );
      })
      .catch((error) => console.error('Error disliking spot:', error));
  };

  return (
    <div className="App">
      <NavBar isAuthenticated={!!currentUser} />
      <Routes>
        <Route path="/signin" element={<SignIn signin={signin} />} />
        <Route path="/signup" element={<SignUp addUser={addUser} />} />
        <Route path="/" element={currentUser ? <Home /> : <Navigate to="/signin" />} />
        <Route path="/about" element={currentUser ? <About /> : <Navigate to="/signin" />} />
        <Route path="/list-of-dives" element={currentUser ? <DiveSpots diveSpots={diveSpots} /> : <Navigate to="/signin" />} />
        <Route path="/dive-spot/:id" element={currentUser ? <DiveSpotDetails currentUser={currentUser} /> : <Navigate to="/signin" />} />
        <Route path="/:username" element={currentUser ? <Home /> : <Navigate to="/signin" />} />
      </Routes>
    </div>
  );
}

export default App;
