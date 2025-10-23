const Product = require('../models/product');

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const { 
        limit = 0,
        minPrice,
        maxPrice,
        category,
        search,
        minStock,
        maxStock,
        sortBy = 'createdAt',
        order = 'desc'
      } = req.query;

      // Build filter object
      const filter = {};

      // Price filter
      if (minPrice !== undefined || maxPrice !== undefined) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      // Category filter
      if (category) {
        filter.category = category;
      }

      // Stock filter
      if (minStock !== undefined || maxStock !== undefined) {
        filter.stock = {};
        if (minStock) filter.stock.$gte = Number(minStock);
        if (maxStock) filter.stock.$lte = Number(maxStock);
      }

      // Search by name or SKU
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { sku: { $regex: search, $options: 'i' } }
        ];
      }

      // Create sort object
      const sortOrder = order === 'desc' ? -1 : 1;
      const sortOptions = { [sortBy]: sortOrder };

      const products = await Product.find(filter)
        .sort(sortOptions)
        .limit(Number(limit));

      res.json({
        count: products.length,
        products
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  createProduct: async (req, res) => {
    const { name, sku, price, stock, category } = req.body;

    if (!name || !sku || price == null || stock == null) {
      return res.status(400).json({ error: 'Missing required fields (name, sku, price, stock)' });
    }

    try {
      const existing = await Product.findOne({ sku });
      if (existing) {
        return res.status(409).json({ error: 'SKU already exists' });
      }

      const newProduct = new Product({ name, sku, price, stock, category });
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deleteProduct: async (req, res) => {
    const id = req.params.id;
    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  updateProduct: async (req, res) => {
    const id = req.params.id;
    const { name, sku, price, stock, category } = req.body;

    try {
      if (sku) {
        const skuOwner = await Product.findOne({ sku, _id: { $ne: id } });
        if (skuOwner) {
          return res.status(409).json({ error: 'SKU already exists' });
        }
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, sku, price, stock, category },
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json({ message: 'Product updated successfully', updatedProduct });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = productController;
