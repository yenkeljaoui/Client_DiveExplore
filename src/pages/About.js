// src/pages/About.js
import React, { useEffect, useState } from 'react';
import './About.css';

const About = () => {
  const [content, setContent] = useState('');
  const [team, setTeam] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5001/about')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setContent(data.content))
      .catch(error => {
        console.error('Error fetching about content:', error);
        setError('Failed to load content. Please try again later.');
      });

    fetch('http://localhost:5001/team')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setTeam(data))
      .catch(error => {
        console.error('Error fetching team content:', error);
        setError('Failed to load team content. Please try again later.');
      });
  }, []);

  return (
    <div className="about-container">
      <h1>About Dives</h1>
      {error ? <p className="error">{error}</p> : <p className="content">{content}</p>}
      <h2>Our Team</h2>
      <ul className="team-list">
        {team.map(member => (
          <li key={member.name} className="team-member">
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default About;
