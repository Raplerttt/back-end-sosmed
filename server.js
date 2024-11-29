const express = require('express');
const userRoutes = require('./routes/userRoutes'); // Pastikan path sesuai dengan lokasi file routes
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const logger = require('./middleware/logger');
const rateLimiter = require('./middleware/rateLimiter');
const orderRoutes = require('./routes/orderRoutes')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Izinkan hanya asal ini
  methods: 'GET, POST, PUT, DELETE', // Metode HTTP yang diizinkan
  allowedHeaders: 'Content-Type, Authorization', // Header yang diizinkan
  credentials: true, // Izinkan pengiriman kredensial (cookies)
};

app.use(cors(corsOptions)); // Gunakan middleware CORS dengan opsi

app.use(express.json());
app.use(cookieParser());
app.use(logger);
app.use(rateLimiter);

// Menghubungkan routes
app.use('/api/user', userRoutes);
app.use('/api/order', orderRoutes);
app.use(errorHandler);

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
