const Rental = require('../models/Rental');

// Add a rental (user lists their item)
exports.addRental = async (req, res) => {
  try {
    const rental = new Rental({ ...req.body, owner: req.user.id });
    await rental.save();
    res.status(201).json(rental);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all rentals
exports.getRentals = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate('owner', 'name email phone')
      .populate('bookings.renter', 'name email phone');
    res.status(200).json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get rentals listed by logged-in user
exports.getMyRentals = async (req, res) => {
  try {
    const myRentals = await Rental.find({ owner: req.user.id })
      .populate('bookings.renter', 'name email phone');
    res.status(200).json(myRentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get rentals booked by logged-in user
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Rental.find({ 'bookings.renter': req.user.id })
      .populate('owner', 'name email phone')
      .populate('bookings.renter', 'name email phone');

    const myBookings = bookings.map(rental => {
      const userBookings = rental.bookings.filter(b => b.renter._id.toString() === req.user.id);
      return { rental, bookings: userBookings };
    });

    res.status(200).json(myBookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Book rental (user rents someone else's item)
exports.bookRental = async (req, res) => {
  try {
    const { rentalId } = req.params;
    const { startDate, endDate } = req.body;

    const rental = await Rental.findById(rentalId);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check overlapping bookings
    const isAvailable = rental.bookings.every(booking => {
      const bStart = new Date(booking.startDate);
      const bEnd = new Date(booking.endDate);
      return !(start <= bEnd && end >= bStart);
    });

    if (!isAvailable) return res.status(400).json({ message: 'Rental not available for selected dates' });

    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const totalPrice = rental.pricePerDay * diffDays;

    rental.bookings.push({
      renter: req.user.id,
      startDate: start,
      endDate: end,
      totalPrice
    });

    await rental.save();
    res.status(200).json({ message: 'Rental booked', rental });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const { rentalId, bookingId } = req.params;
    const rental = await Rental.findById(rentalId);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });

    const index = rental.bookings.findIndex(
      b => b._id.toString() === bookingId && b.renter.toString() === req.user.id
    );

    if (index === -1) return res.status(404).json({ message: 'Booking not found or not yours' });

    rental.bookings.splice(index, 1);
    await rental.save();
    res.status(200).json({ message: 'Booking canceled', rental });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark rental as returned (owner marks booking complete)
exports.markReturned = async (req, res) => {
  try {
    const { rentalId, bookingId } = req.params;
    const rental = await Rental.findById(rentalId);
    if (!rental) return res.status(404).json({ message: 'Rental not found' });

    const booking = rental.bookings.find(b => b._id.toString() === bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.isReturned = true;
    await rental.save();
    res.status(200).json({ message: 'Rental marked as returned', rental });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
