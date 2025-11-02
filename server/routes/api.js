const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const verifyAdminToken = require('../middleware/authMiddleware');

// Product API routes
router.get('/products', verifyAdminToken, productController.getAllProducts);
router.post('/products', verifyAdminToken, productController.createProduct);
router.put('/products/:id', verifyAdminToken, productController.updateProduct);
router.delete('/products/:id', verifyAdminToken, productController.deleteProduct);

module.exports = router;

