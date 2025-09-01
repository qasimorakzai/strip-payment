const router = require('express').Router();
const controller = require('../controllers/orderController');

router.get('/', controller.getAll);

module.exports = router;
