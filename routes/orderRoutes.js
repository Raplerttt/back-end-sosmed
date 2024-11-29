const express = require('express');
const router = express.Router();
const { createOrder } = require('../controllers/orderControllers');
const authenticateJWT = require('../middleware/authenticateJWT');

// Route untuk membuat order baru
router.post('/submit', authenticateJWT, createOrder);

module.exports = router;
