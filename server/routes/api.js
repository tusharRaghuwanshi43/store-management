const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Product API routes
router.get('/products', productController.getAllProducts);
router.post('/addProduct', productController.createProduct);
router.delete('/products/:id', productController.deleteProduct);
router.put('/products/:id', productController.updateProduct);

module.exports = router;

