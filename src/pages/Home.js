// src/pages/Home.js
import React from 'react';
import './Home.css';
import background from '../assets/images/background.jpg';

const Home = () => {
  return (
    <div className="home-container" style={{ backgroundImage: `url(${background})` }}>
      <h1>Welcome to DiveExplore</h1>
      <p>social network</p>
    </div>
  );
};

export default Home;
