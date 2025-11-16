const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'items.itemType' },
  itemType: { type: String, required: true, enum: ['Product', 'Rental'] }, // type of item
  name: String,
  quantity: { type: Number, default: 1 }, // For products
  startDate: Date,  // For rentals
  endDate: Date,    // For rentals
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'completed', 'canceled'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
