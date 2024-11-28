const rateLimit = require('express-rate-limit');

// Membatasi hanya 5 permintaan dalam 1 menit untuk setiap IP
const limiter = rateLimit({
  windowMs: 60 * 1000,  // 1 menit
  max: 5,  // Maksimal 5 permintaan per IP
  message: 'Terlalu banyak permintaan, coba lagi nanti.'
});

module.exports = limiter;
