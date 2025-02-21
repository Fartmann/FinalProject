// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const User = require('../models/User')

const isAdmin = async (req, res, next) => {
  try {
      const user = await User.findById(req.user._id);
      if (!user.isAdmin) {
          return res.status(403).send({ message: 'Forbidden: Admin access required' });
      }
      next();
  } catch (error) {
      res.status(500).send({ message: 'Server error' });
  }
};

router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!product) {
          return res.status(404).send({ message: 'Product not found' });
      }
      res.send(product);
  } catch (error) {
      res.status(400).send(error);
  }
});

router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
          return res.status(404).send({ message: 'Product not found' });
      }
      res.send({ message: 'Product deleted' });
  } catch (error) {
      res.status(500).send(error);
  }
});

module.exports = router;