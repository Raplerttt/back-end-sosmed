const { body, validationResult } = require('express-validator');

// Validasi input untuk registrasi
const validateRegistration = [
  body('email').isEmail().withMessage('Email tidak valid'),
  body('username').notEmpty().withMessage('Username harus diisi'),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  body('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Konfirmasi password tidak cocok'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validasi input untuk login
const validateLogin = [
  body('username').notEmpty().withMessage('Username harus diisi'),
  body('password').notEmpty().withMessage('Password harus diisi'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateRegistration, validateLogin };
