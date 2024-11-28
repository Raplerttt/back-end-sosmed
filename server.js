const express = require('express');
const userRoutes = require('./routes/userRoutes'); // Pastikan path sesuai dengan lokasi file routes
const dotenv = require('dotenv');
const cors = require('cors')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(cors())
app.use(express.json());

// Menghubungkan routes
app.use('/api/auth', userRoutes);

// Endpoint Root
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Error Handling
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
