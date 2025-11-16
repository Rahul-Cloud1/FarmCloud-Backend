const express = require('express');
const router = express.Router();
const {
  addRental,
  getRentals,
  getMyRentals,
  getMyBookings,
  bookRental,
  cancelBooking,
  markReturned
} = require('../controllers/rentalController');

const { protect } = require('../middleware/authMiddleware'); // JWT auth

// Listings
router.post('/', protect, addRental);                 // Add item for rent
router.get('/', getRentals);                          // Browse all rentals
router.get('/my-listings', protect, getMyRentals);   // Rentals user owns
router.get('/my-bookings', protect, getMyBookings);  // Rentals user booked

// Booking
router.post('/:rentalId/book', protect, bookRental);                     // Rent an item
router.delete('/:rentalId/bookings/:bookingId', protect, cancelBooking); // Cancel booking
router.put('/:rentalId/bookings/:bookingId/return', protect, markReturned); // Mark returned

module.exports = router;
