const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'Customer', 'Admin', 'Mandi'], default: 'farmer' },
  location: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
