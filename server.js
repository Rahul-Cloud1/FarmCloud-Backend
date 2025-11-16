const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);

const rentalRoutes = require('./routes/rentalRoutes');
app.use('/api/rentals', rentalRoutes);
require('dotenv').config();  // must be at the top
console.log(process.env.WEATHER_API_KEY); // test if key is loaded
const weatherRoutes = require('./routes/weatherRoutes');
app.use('/api/weather', weatherRoutes);
const orderRoutes = require('./routes/orderRoutes');
app.use('/api/orders', orderRoutes);






// Test route
app.get('/', (req, res) => res.send('FarmCloud Backend is Running!'));

// DB connection is handled by `utils/dbConnect.js` so tests can control it.
const { connectDB } = require('./utils/dbConnect');

// Start server only when not testing so tests can import the app directly.
if (process.env.NODE_ENV !== 'test') {
  connectDB()
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
