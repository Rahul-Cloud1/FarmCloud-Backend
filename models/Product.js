const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  category: { type: String, required: true }, // seeds, fertilizer, fruits, etc.
  image: String, // URL for product image
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // linked to user
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
