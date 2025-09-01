# 🛍️ Stripe E-Commerce Project

Ye ek simple e-commerce project hai jo Stripe payment gateway use karta hai. Isme Node.js, Express, MongoDB aur Stripe ka integration hai.

## 🚀 Features

- ✅ Product listing with beautiful UI
- ✅ Secure Stripe payment integration
- ✅ MongoDB database for products and orders
- ✅ Real-time payment processing
- ✅ Responsive design
- ✅ Error handling

## 📋 Prerequisites

Aapke system mein ye installed hona chahiye:
- Node.js (v14+)
- MongoDB
- Stripe account

## 🛠️ Setup Instructions

### 1. Dependencies Install Karein
```bash
npm install
```

### 2. MongoDB Start Karein
MongoDB ko local machine par start karein ya MongoDB Atlas use karein.

### 3. Stripe Keys Setup Karein
1. [Stripe Dashboard](https://dashboard.stripe.com/) par jao
2. Test keys copy karein
3. `server.js` mein line 4 par secret key update karein:
   ```javascript
   const stripe = require('stripe')('sk_test_your_actual_secret_key_here');
   ```
4. `public/script.js` mein line 2 par publishable key update karein:
   ```javascript
   const stripe = Stripe('pk_test_your_actual_publishable_key_here');
   ```

### 4. Server Start Karein
```bash
npm start
```

### 5. Browser mein jao
```
http://localhost:3000
```

## 🏗️ Project Structure

```
stripe-method/
├── server.js          # Main server file
├── package.json       # Dependencies
├── public/
│   ├── index.html     # Frontend HTML
│   └── script.js      # Frontend JavaScript
└── README.md          # This file
```

## 💳 Payment Testing

Stripe test cards use karein:

| Card Number | Result |
|-------------|--------|
| 4242 4242 4242 4242 | ✅ Success |
| 4000 0000 0000 0002 | ❌ Declined |
| 4000 0000 0000 9995 | ❌ Insufficient Funds |

## 🔧 API Endpoints

### Products
- `GET /api/products` - All products get karein
- `GET /api/products/:id` - Single product get karein

### Payments
- `POST /api/create-payment-intent` - Payment intent create karein
- `POST /api/confirm-payment` - Payment confirm karein

### Orders
- `GET /api/orders` - All orders get karein

## 🎯 How It Works

1. **Product Display**: Server automatically 3 sample products add karta hai
2. **Buy Process**: User product select karta hai aur "Buy Now" click karta hai
3. **Payment Modal**: Payment form open hota hai
4. **Stripe Integration**: 
   - Payment intent create hota hai
   - Card details validate hote hain
   - Payment process hota hai
5. **Order Creation**: Successful payment ke baad order database mein save hota hai

## 🔒 Security Features

- Stripe Elements for secure card input
- Server-side payment validation
- Environment variables for sensitive data
- CORS protection

## 🐛 Troubleshooting

### MongoDB Connection Error
- MongoDB service start karein
- Connection string check karein

### Stripe Payment Error
- Stripe keys verify karein
- Test cards use karein
- Network connectivity check karein

### Port Already in Use
```bash
# Different port use karein
PORT=3001 npm start
```

## 📱 Responsive Design

Project mobile aur desktop dono devices par work karta hai.

## 🎨 UI Features

- Modern gradient design
- Hover effects
- Loading states
- Error messages
- Success notifications

## 🔄 Development

Development mode mein run karein:
```bash
npm run dev
```

## 📞 Support

Agar koi problem hai to:
1. Console errors check karein
2. Network tab mein API calls verify karein
3. MongoDB connection status check karein

---

**Note**: Ye project development/testing ke liye hai. Production mein use karne se pehle security measures implement karein.
