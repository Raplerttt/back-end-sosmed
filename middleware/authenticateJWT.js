const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  // Mengambil token dari cookie
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'Access denied. No token provided.' });
  }

  // Verifikasi token JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user; // Menyimpan data user ke dalam request untuk digunakan di route selanjutnya
    next(); // Lanjutkan ke route berikutnya
  });
};

module.exports = authenticateJWT;
