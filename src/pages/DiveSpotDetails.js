import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './DiveSpotDetails.css';




const DiveSpotDetails = ({ currentUser }) => {
  const { id } = useParams();
  const [spot, setSpot] = useState(null);
  const [newFish, setNewFish] = useState('');
  const [showUsers, setShowUsers] = useState(false);
  const [usersInterested, setUsersInterested] = useState([]);




const fetchDiveSpotDetails = async (id) => {
  try {
    console.log('sent id', { id });
    const response = await fetch(`http://localhost:3001/dive-spots/${id}`);
    if (!response.ok) throw new Error('Dive spot not found');
    const spot = await response.json();
    console.log('Data received:', spot);
    return spot;
  } catch (error) {
    console.error('Error fetching dive spot details:', error);
    return null;
  }
};


  useEffect(() => {
    const getSpotDetails = async () => {
      const spotDetails = await fetchDiveSpotDetails(id);
      setSpot(spotDetails);
    };
    getSpotDetails();
  }, [id]);

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:3001/dive-spots/${id}/like`, {
        method: 'POST'
      });
      const updatedSpot = await response.json();
      setSpot(updatedSpot);
    } catch (error) {
      console.error('Error liking dive spot:', error);
    }
  };

  const handleAddFish = async () => {
    try {
      const response = await fetch(`http://localhost:3001/dive-spots/${id}/fish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fishName: newFish })
      });
      const updatedFish = await response.json();
      setSpot((prevSpot) => ({ ...prevSpot, fish: updatedFish }));
      setNewFish('');
    } catch (error) {
      console.error('Error adding fish:', error);
    }
  };

  const handleAddPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await fetch(`http://localhost:3001/dive-spots/${id}/photo`, {
        method: 'POST',
        body: formData
      });
      const imageUrl = await response.json();
      setSpot((prevSpot) => ({ ...prevSpot, images: [...prevSpot.images, imageUrl] }));
    } catch (error) {
      console.error('Error adding photo:', error);
    }
  };

  const handleRegisterInterest = async () => {
    try {
      console.log('name i sent',currentUser);
      const response = await fetch(`http://localhost:3001/dive-spots/${id}/interest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName: currentUser }) // Send current user name
      });
      if (response.ok) {
        const updatedSpot = await response.json();
        setSpot(updatedSpot);
      } else {
        console.error('Failed to register interest');
      }
    } catch (error) {
      console.error('Error registering interest:', error);
    }
  };


  const handleToggleUsers = async () => {
    try {
      const response = await fetch(`http://localhost:3001/dive-spots/${id}/list_interest`);
      if (response.ok) {
        const interestedUsers = await response.json();
        console.log('Interested users:', interestedUsers);
        setUsersInterested(interestedUsers);
        setShowUsers(!showUsers); // Toggle visibility
      } else {
        console.error('Failed to fetch interested users');
      }
    } catch (error) {
      console.error('Error fetching interested users:', error);
    }
  };

  

  if (!spot) return <div>Dive spot not found</div>;

  return (
    <div className='spot-details-container'>
      <h1>{spot.name}</h1>
      <p className='spot-description'>{spot.description}</p>

      <h2>Photos</h2>
      <div className='carousel'>
        {spot.images.length > 0 ? (
          spot.images.map((image, index) => (
            <div key={index} className='carousel-image'>
              <img src={image} alt={`Dive spot ${index + 1}`} />
            </div>
          ))
        ) : (
          <p>No photos available</p>
        )}
      </div>
      <div className='upload-container'>
        <input type='file' onChange={handleAddPhoto} />
      </div>

      <h2>Fish You Can Find Here</h2>
      <ul>
        {spot.fish.map((fish, index) => (
          <li key={index}>{fish}</li>
        ))}
      </ul>
      <div className='fish-container'>
        <input
          type='text'
          value={newFish}
          onChange={(e) => setNewFish(e.target.value)}
          placeholder='Add a new fish'
        />
        <button onClick={handleAddFish}>Add Fish</button>
      </div>

      <div className='like-dislike-container'>
        <div className='like-dislike-buttons'>
          <button className='like-button' onClick={handleLike}>
            <i className='fas fa-thumbs-up'></i> Like {spot.likes}
          </button>
        </div>
      </div>

      <button className='register-diver-button' onClick={handleToggleUsers}>
        {showUsers ? 'Hide Interested Users' : 'Show Interested Users'}
      </button>
      {showUsers && (
  <div className='users-list'>
    <h2>Users Interested</h2>
    <ul>
      {usersInterested.length > 0 ? (
        usersInterested.map((user, index) => (
          <li key={index}>{user}</li> // Assuming the user is just a string, adjust if needed
        ))
      ) : (
        <p>No users interested yet</p>
      )}
    </ul>
  </div>
)}

      <button className='register-diver-button' onClick={handleRegisterInterest}>
        Register Interest
      </button>
    </div>
  );
};

export default DiveSpotDetails;
