import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const fetchDivingSpots = async () => {
  try {
    const response = await fetch('http://localhost:3001');
    const spots = await response.json();
    console.log('Fetched diving spots:', spots);
    return spots;
  } catch (error) {
    console.error('Error fetching diving spots:', error);
    return [];
  }
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};

const sortSpotsByDistance = (spots, userLatitude, userLongitude) => {
  return spots.sort((a, b) => {
    const distanceA = calculateDistance(userLatitude, userLongitude, a.latitude, a.longitude);
    const distanceB = calculateDistance(userLatitude, userLongitude, b.latitude, b.longitude);
    return distanceA - distanceB;
  });
};

const DiveSpots = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [divingSpots, setDivingSpots] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('User\'s location:', { latitude, longitude });
        setUserLocation({ latitude, longitude });
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  }, []);

  useEffect(() => {
    const getDivingSpots = async () => {
      const spots = await fetchDivingSpots();
      if (userLocation) {
        const sortedSpots = sortSpotsByDistance(spots, userLocation.latitude, userLocation.longitude);
        setDivingSpots(sortedSpots);
      } else {
        setDivingSpots(spots);
      }
    };
    getDivingSpots();
  }, [userLocation]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Diving Spots Around the World</h1>
      <div>
        {divingSpots.map((spot) => (
          <div key={spot.id} style={{ margin: '10px 0' }}>
            <Link to={`/dive-spot/${spot.id}`}>
              {spot.name} - {spot.location}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiveSpots;
