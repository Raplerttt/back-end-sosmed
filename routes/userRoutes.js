const express = require('express');
const { registerUser, loginUser, getUserById, getUserByName } = require('../controllers/userController');
const authenticateJWT = require('../middleware/authenticateJWT');
const { validateRegistration, validateLogin } = require('../middleware/validateInput');
const authorizeRole = require('../middleware/authorizeRole');

const router = express.Router();

// Route untuk register user (dengan validasi input)
router.post('/register', validateRegistration, registerUser);

// Route untuk login user (dengan validasi input)
router.post('/login', validateLogin, loginUser);

// Route untuk mendapatkan user berdasarkan ID (dilindungi dengan autentikasi dan cek peran)
router.get('/protected-user/:id', authenticateJWT, authorizeRole(['admin', 'user']), getUserById);

router.get('/username', authenticateJWT, getUserByName);

module.exports = router;
