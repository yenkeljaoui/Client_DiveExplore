// src/App.js
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

const initialUsers = [
  {
    username: 'yenkel',
    password: 'Yenkel@23',
  },
];

const initialDiveSpots = [
  {
    id: '1',
    name: 'Blue Hole',
    description: 'A famous diving spot with beautiful coral reefs and marine life.',
    images: [],
    fish: ['Clownfish', 'Lionfish', 'Turtles'],
    likes: 0,
    dislikes: 0,
    userLikes: [],
    userDislikes: [],
  },
  // Add more dive spots as needed
];

function App() {
  const [users, setUsers] = useState(initialUsers);
  const [currentUser, setCurrentUser] = useState(null);
  const [diveSpots, setDiveSpots] = useState(initialDiveSpots);

  const addUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  const signin = (username, password) => {
    const existingUser = users.find(
      (user) => user.username === username && user.password === password
    );
    if (!existingUser) {
      alert('User not found');
      return null;
    } else {
      setCurrentUser(existingUser);
      return existingUser.username;
    }
  };

  const addPhoto = (spotId, photoDataUrl) => {
    setDiveSpots((prevSpots) =>
      prevSpots.map((spot) =>
        spot.id === spotId
          ? { ...spot, images: [...spot.images, photoDataUrl] }
          : spot
      )
    );
  };

  const addFish = (spotId, fishName) => {
    setDiveSpots((prevSpots) =>
      prevSpots.map((spot) =>
        spot.id === spotId
          ? { ...spot, fish: [...spot.fish, fishName] }
          : spot
      )
    );
  };

  const likeSpot = (spotId) => {
    setDiveSpots((prevSpots) =>
      prevSpots.map((spot) => {
        if (spot.id === spotId) {
          if (!spot.userLikes.includes(currentUser.username)) {
            return {
              ...spot,
              likes: spot.likes + 1,
              userLikes: [...spot.userLikes, currentUser.username],
            };
          }
        }
        return spot;
      })
    );
  };

  const dislikeSpot = (spotId) => {
    setDiveSpots((prevSpots) =>
      prevSpots.map((spot) => {
        if (spot.id === spotId) {
          if (!spot.userDislikes.includes(currentUser.username)) {
            return {
              ...spot,
              dislikes: spot.dislikes + 1,
              userDislikes: [...spot.userDislikes, currentUser.username],
            };
          }
        }
        return spot;
      })
    );
  };

  return (
    <div className="App">
      <NavBar isAuthenticated={!!currentUser} />
      <Routes>
        <Route path="/signin" element={<SignIn signin={signin} />} />
        <Route path="/signup" element={<SignUp addUser={addUser} />} />
        <Route
          path="/"
          element={currentUser ? <Home /> : <Navigate to="/signin" />}
        />
        <Route
          path="/about"
          element={currentUser ? <About /> : <Navigate to="/signin" />}
        />
        <Route
          path="/list-of-dives"
          element={currentUser ? <DiveSpots diveSpots={diveSpots} /> : <Navigate to="/signin" />}
        />
        <Route
          path="/dive-spot/:id"
          element={currentUser ? <DiveSpotDetails diveSpots={diveSpots} addPhoto={addPhoto} addFish={addFish} likeSpot={likeSpot} dislikeSpot={dislikeSpot} /> : <Navigate to="/signin" />}
        />
        <Route
          path="/:username"
          element={currentUser ? <Home /> : <Navigate to="/signin" />}
        />
      </Routes>
    </div>
  );
}

export default App;
