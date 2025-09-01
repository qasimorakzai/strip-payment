const mongoose = require('mongoose');

// Order Schema
const orderSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentIntentId: { type: String, required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'completed', 'failed'] },
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
