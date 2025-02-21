const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const Product = require('../models/Product');

router.post('/', auth, async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        const product = await Product.findById(req.body.items[0].product);
        console.log("Found Product:", product);
        if (!product) {
            return res.status(400).send({ message: "Product not found" });
        }
        const order = new Order({ ...req.body, user: req.user._id, total: product.price });
        await order.save();
        res.status(201).send(order);
    } catch (error) {
        console.error("Order Creation Error:", error);
        res.status(400).send({ message: error.message, stack: error.stack });
    }
});

router.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('items.product');
        res.send(orders);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;