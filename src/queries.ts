import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function registerUser(data: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}) {
  const { username, email, password, confirmPassword, name } = data;

  // Validasi input
  if (!username || !email || !password || !confirmPassword) {
    throw new Error('All fields (username, email, password, confirmPassword) are required.');
  }

  if (password !== confirmPassword) {
    throw new Error('Password and confirmation password do not match.');
  }

  // Periksa apakah email atau username sudah digunakan
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username },
      ],
    },
  });

  if (existingUser) {
    throw new Error('Email or username is already registered.');
  }

  // Hash password sebelum menyimpan
  const hashedPassword = await bcrypt.hash(password, 10);

  // Simpan user ke database
  const newUser = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      name, // `name` opsional
    },
  });

  console.log('User registered:', newUser);
  return newUser;
}

async function main() {
  try {
    // Simulasi pendaftaran pengguna
    const newUser = await registerUser({
      username: 'JohnDoe',
      email: 'johndoe@example.com',
      password: 'securepassword',
      confirmPassword: 'securepassword',
      name: 'John Doe', // Opsional
    });

    console.log('Registration successful:', newUser);
  } catch (error: any) {
    console.error('Registration failed:', error.message);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
