const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

const checkUserExists = async (email, username) => {
    // Cek apakah email sudah terdaftar
    const userByEmail = await prisma.user.findUnique({
      where: {
        email: email
      }
    });
    if (userByEmail) {
      throw new Error("Email sudah terdaftar");
    }
  
    // Cek apakah username sudah digunakan
    const userByUsername = await prisma.user.findUnique({
      where: {
        username: username
      }
    });
    if (userByUsername) {
      throw new Error("Username sudah digunakan");
    }
  };

  const registerUser = async (req, res) => {
    const { email, username, name, password, confirmPassword } = req.body;
  
    // Validasi bahwa password dan konfirmasi password cocok
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Password dan konfirmasi password tidak cocok" });
    }
  
    try {
      // Memeriksa apakah email dan username sudah ada
      await checkUserExists(email, username);
  
      // Hash password sebelum disimpan
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Membuat user baru
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          username,
          password: hashedPassword
        }
      });
  
      // Merespons dengan pesan sukses
      return res.status(201).json({
        message: 'User created successfully',
        user: { email, name, username }
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message || "Terjadi kesalahan saat menghubungi server." });
    }
  };

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

        const token = jwt.sign(
            { id: user.id, NIK: user.NIK, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        handleError(res, error, "Login error");
    }
};


module.exports = {
  registerUser,
  loginUser
};
