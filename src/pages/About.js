import React, { useEffect, useState } from 'react';
import './About.css';

const About = () => {
  const [projectDescription, setProjectDescription] = useState('');
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    // fetch('http://localhost:3001/about')               //get from server that run locally
    fetch('https://serverdiveexplore.onrender.com/about')     //get from server that run from cloud
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setProjectDescription(data.projectDescription); // Update to reflect projectDescription
        // Ensure `members` is an array
        if (Array.isArray(data.members)) {
          setMembers(data.members);
        } else {
          setError('Invalid members data format');
        }
      })
      .catch(error => {
        // console.error('Error fetching about content:', error);
        setError('Failed to load content. Please try again later.');
      });
  }, []);

  return (
    <div className="about-container">
      <h1>About Dives</h1>
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <div>
          <p className="content">{projectDescription}</p>
          <h2>Our Team</h2>
          <ul className="team-list">
            {members.length > 0 ? (
              members.map(member => (
                <li key={member.ID} className="team-member">
                  <h3>{member.name}</h3>
                  <p>ID: {member.ID}</p>
                </li>
              ))
            ) : (
              <p>No team members available</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default About;