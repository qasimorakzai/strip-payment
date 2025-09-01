require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const connectDB = require('./config/db');
const productsRoute = require('./routes/products');
const ordersRoute = require('./routes/orders');
const paymentsRoute = require('./routes/payments');

const app = express();
const PORT = process.env.PORT || 3000;

// DB
connectDB(process.env.MONGODB_URI);

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_ORIGIN ? [process.env.CLIENT_ORIGIN] : true,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static front-end
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/products', productsRoute);
app.use('/api/orders', ordersRoute);
app.use('/api', paymentsRoute);

// Seed products once (only if none exist)
const Product = require('./models/Product');
async function seed() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany([
        {
          name: 'iPhone 15 Pro',
          price: 999,
          description: 'Latest iPhone with advanced features',
          image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
        },
        {
          name: 'MacBook Air M2',
          price: 1199,
          description: 'Powerful laptop with M2 chip',
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        },
        {
          name: 'AirPods Pro',
          price: 249,
          description: 'Wireless earbuds with noise cancellation',
          image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800',
        },
      ]);
      console.log('🌱 Sample products inserted');
    }
  } catch (e) {
    console.error('Seed error:', e);
  }
}
seed();

// SPA entry
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running http://localhost:${PORT}`);
});
