const express = require('express');
const cors = require('cors'); 
const app = express();
const port = 3001;

const divingSpots = [
    { id: 1, name: 'Great Barrier Reef', location: 'Australia', latitude: -18.2871, longitude: 147.6992, description: 'A famous diving spot with beautiful coral reefs and marine life.', images: [], fishes: [] },
    { id: 2, name: 'Blue Hole', location: 'Belize', latitude: 17.3419, longitude: -87.5366, description: 'A deep blue hole in the ocean.', images: [], fishes: [] },
    { id: 3, name: 'Red Sea', location: 'Egypt', latitude: 27.2167, longitude: 33.5833, description: 'A beautiful diving spot with diverse marine life.', images: [], fishes: [] },
    { id: 4, name: 'Ashdod', location: 'Israel', latitude: 31.7611, longitude: 34.6333, description: 'A local diving spot in Israel.', images: [], fishes: [] }
];

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json(divingSpots);
});

app.get('/spots/:id', (req, res) => {
    const spotId = parseInt(req.params.id);
    const spot = divingSpots.find(s => s.id === spotId);
    if (spot) {
        res.json(spot);
    } else {
        res.status(404).send('Spot not found');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
