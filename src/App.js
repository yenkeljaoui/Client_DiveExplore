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

function App() {
  const [users, setUsers] = useState(initialUsers);
  const [currentUser, setCurrentUser] = useState(null);

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
          element={currentUser ? <DiveSpots /> : <Navigate to="/signin" />}
        />
        <Route
          path="/dive-spot/:id"
          element={currentUser ? <DiveSpotDetails /> : <Navigate to="/signin" />}
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
