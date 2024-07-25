import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './DiveSpotDetails.css';

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

const DiveSpotDetails = ({ currentUser }) => {
  const { id } = useParams();
  const [spot, setSpot] = useState(null);
  const [newFish, setNewFish] = useState('');

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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: currentUser.username })
      });
      const updatedSpot = await response.json();
      setSpot(updatedSpot);
    } catch (error) {
      console.error('Error liking dive spot:', error);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await fetch(`http://localhost:3001/dive-spots/${id}/dislike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: currentUser.username })
      });
      const updatedSpot = await response.json();
      setSpot(updatedSpot);
    } catch (error) {
      console.error('Error disliking dive spot:', error);
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
      const imageDataUrl = await response.json();
      setSpot((prevSpot) => ({ ...prevSpot, images: [...prevSpot.images, imageDataUrl] }));
    } catch (error) {
      console.error('Error adding photo:', error);
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
          <button className='dislike-button' onClick={handleDislike}>
            <i className='fas fa-thumbs-down'></i> Dislike {spot.dislikes}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiveSpotDetails;
