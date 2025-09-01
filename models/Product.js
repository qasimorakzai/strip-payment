const mongoose = require('mongoose');

// Product Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
