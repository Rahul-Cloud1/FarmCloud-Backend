const express = require('express');
const router = express.Router();
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

router.post('/', addProduct);          // Add product
router.get('/', getProducts);          // Get all products
router.get('/:id', getProductById);    // Get single product
router.put('/:id', updateProduct);     // Update product
router.delete('/:id', deleteProduct);  // Delete product

module.exports = router;
