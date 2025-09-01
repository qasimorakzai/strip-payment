const Order = require('../models/Order');

exports.getAll = async (req, res) => {
  try {
    const orders = await Order.find().populate('productId');
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};
