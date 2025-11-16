const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createOrder, getMyOrders, getAllOrders } = require('../controllers/orderController');

router.post('/', protect, createOrder);       // Create an order (products + rentals)
router.get('/my-orders', protect, getMyOrders); // User’s own orders
router.get('/', protect, getAllOrders);        // Admin: all orders

module.exports = router;
