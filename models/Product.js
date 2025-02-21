const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, text: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true, index: true },
  imageUrl: {type: String, required: true },
  stock: {type: Number, default: 0}
});

productSchema.index({ price: 1 });
productSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
