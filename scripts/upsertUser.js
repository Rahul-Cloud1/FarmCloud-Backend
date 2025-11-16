require('dotenv').config();
const { connectDB, disconnectDB } = require('../utils/dbConnect');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function upsert() {
  const email = 'a@farmcloud.com';
  const plaintextPassword = 'FarmCloud123!'; // CHANGE this in production
  try {
    await connectDB();
    const hashed = await bcrypt.hash(plaintextPassword, 10);

    // Upsert user - replace or create with known password
    const update = {
      name: 'Dev User',
      email,
      phone: '0000000000',
      password: hashed,
      role: 'Admin',
      location: 'Dev'
    };

    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const user = await User.findOneAndUpdate({ email }, update, options).lean();

    console.log('Upsert complete. User id:', user._id.toString());
    console.log('Email:', user.email);
    console.log('Plaintext password (use this to login):', plaintextPassword);
  } catch (err) {
    console.error('Error upserting user:', err);
  } finally {
    await disconnectDB();
  }
}

upsert();
