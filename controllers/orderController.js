const Order = require('../models/Order');
const Rental = require('../models/Rental');
const Product = require('../models/Product');

// Create an order
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ message: 'No items to order' });

    let totalPrice = 0;

    const orderItems = [];

    for (let i = 0; i < items.length; i++) {
      const { itemId, itemType, quantity, startDate, endDate } = items[i];

      if (itemType === 'Product') {
        const product = await Product.findById(itemId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const price = product.price * quantity;
        totalPrice += price;

        orderItems.push({
          itemId,
          itemType,
          name: product.name,
          quantity,
          price
        });

        // Reduce product quantity
        product.quantity -= quantity;
        await product.save();
      } else if (itemType === 'Rental') {
        const rental = await Rental.findById(itemId);
        if (!rental) return res.status(404).json({ message: 'Rental not found' });

        // Calculate total price
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        const price = rental.pricePerDay * diffDays;
        totalPrice += price;

        // Add booking to rental
        rental.bookings.push({
          renter: req.user.id,
          startDate: start,
          endDate: end,
          totalPrice: price
        });

        await rental.save();

        orderItems.push({
          itemId,
          itemType,
          name: rental.title,
          startDate: start,
          endDate: end,
          price
        });
      } else {
        return res.status(400).json({ message: 'Invalid item type' });
      }
    }

    const order = new Order({
      user: req.user.id,
      items: orderItems,
      totalPrice
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get orders of logged-in user
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.itemId', 'name title category');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
