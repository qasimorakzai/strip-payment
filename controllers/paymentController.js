const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Product = require('../models/Product');
const Order = require('../models/Order');

/**
 * Step 1: Create PaymentIntent + Order(pending)
 */
exports.createPaymentIntent = async (req, res) => {
  try {
    const { productId, customerName, customerEmail } = req.body;
    if (!productId || !customerName || !customerEmail) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const amountInCents = Math.round(product.price * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true }, 
      metadata: {
        productId: String(productId),
        customerName,
        customerEmail,
      },
    });

    const order = await Order.create({
      productId,
      customerName,
      customerEmail,
      amount: product.price,
      paymentIntentId: paymentIntent.id,
      status: 'pending',
    });

    res.json({ clientSecret: paymentIntent.client_secret, orderId: order._id });
  } catch (e) {
    console.error('createPaymentIntent error:', e);
    res.status(500).json({ error: 'Payment intent creation failed' });
  }
};


exports.confirmPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

   
    const pi = await stripe.paymentIntents.retrieve(order.paymentIntentId);

    if (pi.status === 'succeeded') {
      order.status = 'completed';
      await order.save();
      return res.json({ message: 'Payment confirmed successfully', order });
    } else if (pi.status === 'requires_payment_method' || pi.status === 'canceled') {
      order.status = 'failed';
      await order.save();
      return res.status(400).json({ error: 'Payment not successful', status: pi.status });
    } else {
     
      return res.status(202).json({ message: 'Payment processing', status: pi.status });
    }
  } catch (e) {
    console.error('confirmPayment error:', e);
    res.status(500).json({ error: 'Payment confirmation failed' });
  }
};


exports.getStripeKey = (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
};
