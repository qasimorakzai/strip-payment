const router = require('express').Router();
const controller = require('../controllers/paymentController');

router.get('/stripe-key', controller.getStripeKey);
router.post('/create-payment-intent', controller.createPaymentIntent);
router.post('/confirm-payment', controller.confirmPayment);

module.exports = router;
