const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true},
  category: { type: String},
  cost: { type: String, required: true },
  imagePath: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref:"User", required: true }
});

module.exports = mongoose.model('Product', productSchema);

