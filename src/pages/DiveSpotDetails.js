import React from 'react';
import { useParams } from 'react-router-dom';
import './DiveSpotDetails.css';

const DiveSpotDetails = ({ diveSpots, addPhoto, addFish, likeSpot, dislikeSpot }) => {
  const { id } = useParams();
  const spot = diveSpots.find((spot) => spot.id === id);

  if (!spot) {
    return <div>Dive spot not found</div>;
  }

  const handleAddPhoto = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addPhoto(id, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddFish = (event) => {
    if (event.key === 'Enter') {
      addFish(id, event.target.value);
      event.target.value = '';
    }
  };

  return (
    <div className="spot-details-container">
      <h1>{spot.name}</h1>
      <h2>Description</h2>
      <p className="spot-description">{spot.description}</p>
      
      <h2>Photos</h2>
      <div className="carousel">
        {spot.images.length > 0 ? (
          spot.images.map((image, index) => (
            <div className="carousel-image" key={index}>
              <img src={image} alt={`Dive spot ${index + 1}`} />
            </div>
          ))
        ) : (
          <p>No photos available</p>
        )}
      </div>
      <div className="upload-container">
        <input type="file" onChange={handleAddPhoto} />
        <button onClick={handleAddPhoto}>Add Photo</button>
      </div>

      <h2>Fish You Can Find Here</h2>
      <ul>
        {spot.fish.map((fish, index) => (
          <li key={index}>{fish}</li>
        ))}
      </ul>
      <div className="fish-container">
        <input type="text" placeholder="Add a fish" onKeyDown={handleAddFish} />
      </div>

      <div className="like-dislike-buttons">
        <button className="like-button" onClick={() => likeSpot(id)}>
          <i className="fa fa-thumbs-up"></i> Like {spot.likes}
        </button>
        <button className="dislike-button" onClick={() => dislikeSpot(id)}>
          <i className="fa fa-thumbs-down"></i> Dislike {spot.dislikes}
        </button>
      </div>
    </div>
  );
};

export default DiveSpotDetails;

