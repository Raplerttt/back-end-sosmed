const express = require('express');
const { registerUser, loginUser } = require('../controllers/userController'); // Mengimpor controller
const router = express.Router();

// Endpoint untuk pendaftaran
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
