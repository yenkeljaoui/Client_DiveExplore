import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './DiveSpotDetails.css';

const DiveSpotDetails = ({ currentUser }) => {
  const { id } = useParams();
  const [spot, setSpot] = useState(null);
  const [newFish, setNewFish] = useState('');
  const [showUsers, setShowUsers] = useState(false);
  const [usersInterested, setUsersInterested] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const getSpotDetails = async () => {
      const spotDetails = await fetchDiveSpotDetails(id);
      setSpot(spotDetails);
      setHasLiked(spotDetails?.likedBy?.includes(currentUser) || false);
    };
    getSpotDetails();
  }, [id, currentUser]);

  const fetchDiveSpotDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/dive-spots/${id}`);
      if (!response.ok) throw new Error('Dive spot not found');
      const spot = await response.json();
      return spot;
    } catch (error) {
      console.error('Error fetching dive spot details:', error);
      return null;
    }
  };

  const handleLike = async () => {
    if (hasLiked) {
      console.error('User has already liked this spot');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/dive-spots/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName: currentUser }),
      });
      const updatedSpot = await response.json();
      setSpot(updatedSpot);
      setHasLiked(true);
    } catch (error) {
      console.error('Error liking dive spot:', error);
    }
  };

  const handleAddFish = async () => {
    if (newFish.trim() === '') {
      console.error('Fish name cannot be empty');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/dive-spots/${id}/fish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fishName: newFish }),
      });
      const updatedFish = await response.json();
      setSpot((prevSpot) => ({ ...prevSpot, fish: updatedFish }));
      setNewFish('');
    } catch (error) {
      console.error('Error adding fish:', error);
    }
  };

  const handlePhotoUpload = async () => {
    if (!selectedPhoto) return;

    const formData = new FormData();
    formData.append('photo', selectedPhoto);

    try {
      const response = await fetch(`http://localhost:3001/dive-spots/${id}/photo`, {
        method: 'POST',
        body: formData,
      });
      const updatedSpot = await response.json();
      setSpot(updatedSpot);
      setSelectedPhoto(null);
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  const handleToggleUsers = async () => {
    try {
      const response = await fetch(`http://localhost:3001/dive-spots/${id}/list_interest`);
      if (response.ok) {
        const interestedUsers = await response.json();
        setUsersInterested(interestedUsers);
        setShowUsers(!showUsers);
      } else {
        console.error('Failed to fetch interested users');
      }
    } catch (error) {
      console.error('Error fetching interested users:', error);
    }
  };

  const handleRegisterInterest = async () => {
    try {
      const response = await fetch(`http://localhost:3001/dive-spots/${id}/interest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName: currentUser }),
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

  if (!spot) return <div>Dive spot not found</div>;

  return (
    <div className='spot-details-container'>
      <h1>{spot.name}</h1>
      <p className='spot-description'>{spot.description}</p>

      <h2>Photos</h2>
      <div className='carousel'>
        {spot.images && spot.images.length > 0 ? (
          spot.images.map((image, index) => (
            <div key={index} className='carousel-image'>
              <img src={image.url} alt={`Dive spot ${index + 1}`} />
            </div>
          ))
        ) : (
          <p>No photos available</p>
        )}
      </div>
      <div className='upload-container'>
        <input type='file' onChange={(e) => setSelectedPhoto(e.target.files[0])} />
        <button onClick={handlePhotoUpload}>Upload Photo</button>
      </div>

      <h2>Fish You Can Find Here</h2>
      <ul>
        {spot.fish && spot.fish.length > 0 ? (
          spot.fish.map((fish, index) => (
            <li key={index}>{fish}</li>
          ))
        ) : (
          <p>No fish available</p>
        )}
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
          <button className='like-button' onClick={handleLike} disabled={hasLiked}>
            <i className='fas fa-thumbs-up'></i> Like {spot.likes}
          </button>
        </div>
      </div>

      <button
        className={`register-diver-button ${showUsers ? 'active' : ''}`}
        onClick={handleToggleUsers}
      >
        {showUsers ? 'Hide Interested Users' : 'Show Interested Users'}
      </button>
      {showUsers && (
        <div className='users-list'>
          <h2>Users Interested</h2>
          <ul>
            {usersInterested.length > 0 ? (
              usersInterested.map((user, index) => (
                <li key={index}>{user}</li>
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
