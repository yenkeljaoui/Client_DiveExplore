

const divingSpots = [
    { number: 10, name: 'Blue Hole', location: 'Belize', description: 'A famous diving spot with beautiful coral reefs and marine life.', fish: ['Clownfish', 'Lionfish', 'Turtles'],dislikes: 0, latitude: 17.3151, longitude: -87.5355 },
     { number: 11, name: 'Great Barrier Reef', location: 'Australia', description: 'The largest coral reef system in the world, home to diverse marine life.', fish: ['Clownfish', 'Sharks', 'Rays'],dislikes: 0, latitude: -18.2871, longitude: 147.6992 },
     { number: 12, name: 'Red Sea', location: 'Egypt', description: 'A popular diving destination with clear water and vibrant coral reefs.', fish: ['Butterflyfish', 'Angelfish', 'Moray Eels'],dislikes: 0, latitude: 27.2167, longitude: 33.8333 },
     { number: 41, name: 'Ashdod', location: 'Israel', description: 'A beautiful coastal city with amazing diving spots.', fish: ['Sardines', 'Tuna', 'Mackerel'],dislikes: 0, latitude: 31.8067, longitude: 34.6415 },
  ];
  const sendData = async (data) => {
    try {
      const response = await fetch('https://serverdiveexplore.onrender.com/dive-spots/add_dive_spot', {
      // const response = await fetch('http://localhost:3001/dive-spots/add_dive_spot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const result = await response.json(); // If the server returns JSON
        console.log('Server response:', result);
      } else {
        const errorText = await response.json(); // Read the error message from the server
  
        if (errorText.message === 'Diving spot already exists') {
          console.log(`Diving spot with id ${data.id} already exists.`);
        } else {
          console.error('Failesd to send data:', errorText.message);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  
//   const flag = true; // דגל לצורך תנאי
  const flag = false;
  if (flag) {
    console.log('create dive spot');
    //call the func for every dive spot
    divingSpots.forEach(spot => sendData(spot));
  }
  

