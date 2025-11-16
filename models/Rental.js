const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  renter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  isReturned: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const rentalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: { type: String, required: true }, // machine, tool, land
  pricePerDay: { type: Number, required: true },
  image: String, // URL
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isAvailable: { type: Boolean, default: true },
  bookings: [bookingSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Rental', rentalSchema);
