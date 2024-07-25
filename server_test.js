const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const port = 3001;

const upload = multer({ dest: 'uploads/' });

const divingSpots = [
  { id: '1', name: 'Blue Hole', location: 'Belize', description: 'A famous diving spot with beautiful coral reefs and marine life.', images: [], fish: ['Clownfish', 'Lionfish', 'Turtles'], likes: 0, dislikes: 0, userLikes: [], userDislikes: [], latitude: 17.3151, longitude: -87.5355 },
  { id: '2', name: 'Great Barrier Reef', location: 'Australia', description: 'The largest coral reef system in the world, home to diverse marine life.', images: [], fish: ['Clownfish', 'Sharks', 'Rays'], likes: 0, dislikes: 0, userLikes: [], userDislikes: [], latitude: -18.2871, longitude: 147.6992 },
  { id: '3', name: 'Red Sea', location: 'Egypt', description: 'A popular diving destination with clear water and vibrant coral reefs.', images: [], fish: ['Butterflyfish', 'Angelfish', 'Moray Eels'], likes: 0, dislikes: 0, userLikes: [], userDislikes: [], latitude: 27.2167, longitude: 33.8333 },
  { id: '4', name: 'Ashdod', location: 'Israel', description: 'A beautiful coastal city with amazing diving spots.', images: [], fish: ['Sardines', 'Tuna', 'Mackerel'], likes: 0, dislikes: 0, userLikes: [], userDislikes: [], latitude: 31.8067, longitude: 34.6415 },
];

app.use(express.json());
app.use(cors());

app.get('/dive-spots', (req, res) => {
  res.json(divingSpots);
});

app.get('/dive-spots/:id', (req, res) => {
  const spot = divingSpots.find((spot) => spot.id === req.params.id);
  if (!spot) {
    return res.status(404).send('Dive spot not found');
  }
  res.json(spot);
});

app.post('/dive-spots/:id/like', (req, res) => {
  const spot = divingSpots.find((spot) => spot.id === req.params.id);
  if (!spot) {
    return res.status(404).send('Dive spot not found');
  }
  const { username } = req.body;
  if (!spot.userLikes.includes(username)) {
    spot.likes += 1;
    spot.userLikes.push(username);
  }
  res.json(spot);
});

app.post('/dive-spots/:id/dislike', (req, res) => {
  const spot = divingSpots.find((spot) => spot.id === req.params.id);
  if (!spot) {
    return res.status(404).send('Dive spot not found');
  }
  const { username } = req.body;
  if (!spot.userDislikes.includes(username)) {
    spot.dislikes += 1;
    spot.userDislikes.push(username);
  }
  res.json(spot);
});

app.post('/dive-spots/:id/fish', (req, res) => {
  const spot = divingSpots.find((spot) => spot.id === req.params.id);
  if (!spot) {
    return res.status(404).send('Dive spot not found');
  }
  const { fishName } = req.body;
  spot.fish.push(fishName);
  res.json(spot.fish);
});

app.post('/dive-spots/:id/photo', upload.single('photo'), (req, res) => {
  const spot = divingSpots.find((spot) => spot.id === req.params.id);
  if (!spot) {
    return res.status(404).send('Dive spot not found');
  }
  const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
  spot.images.push(imageUrl);
  res.json(imageUrl);
});

app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
