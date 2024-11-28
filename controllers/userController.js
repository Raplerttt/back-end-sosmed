const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fungsi untuk memeriksa apakah email atau username sudah terdaftar
const checkUserExists = async (email, username) => {
  const userByEmail = await prisma.user.findUnique({ where: { email } });
  if (userByEmail) {
    throw new Error('Email sudah terdaftar');
  }

  const userByUsername = await prisma.user.findUnique({ where: { username } });
  if (userByUsername) {
    throw new Error('Username sudah digunakan');
  }
};

// Fungsi untuk register user
const registerUser = async (req, res) => {
  const { email, username, name, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Password dan konfirmasi password tidak cocok' });
  }

  try {
    await checkUserExists(email, username);
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, name, username, password: hashedPassword }
    });

    return res.status(201).json({
      message: 'User created successfully',
      user: { email, name, username }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Terjadi kesalahan saat menghubungi server.' });
  }
};

// Fungsi untuk login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Cari user berdasarkan username
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    // Membuat token JWT
    const token = jwt.sign(
      { id: user.id, NIK: user.NIK, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token kadaluarsa dalam 1 jam
    );

    // Simpan token di cookie dengan atribut keamanan tambahan
    res.cookie('token', token, {
      httpOnly: true,   // Mencegah akses cookie melalui JavaScript
      secure: process.env.NODE_ENV === 'production', // Hanya kirim cookie melalui HTTPS di production
      sameSite: 'Strict', // Menghindari pengiriman cookie pada permintaan lintas situs
      maxAge: 3600000 // 1 jam
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    // Tangani error yang terjadi
    console.error(error);
    return res.status(500).json({ error: 'Login error' });
  }
};

// Fungsi untuk mendapatkan user berdasarkan ID (protected)
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) } });
    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: 'Terjadi kesalahan saat menghubungi server.' });
  }
};

const getUserByName = async (req, res) => {
  const { username } = req.params;

  try {
    // Cari user berdasarkan username
    const user = await prisma.user.findUnique({
      where: { username },
      select: { name: true }, // Hanya mengambil field 'name'
    });

    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    return res.status(200).json({ name: username });
  } catch (error) {
    console.error("Error fetching user by name:", error);
    return res.status(500).json({ error: 'Terjadi kesalahan server.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  getUserByName
};
