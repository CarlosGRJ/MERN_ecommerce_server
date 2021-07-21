const express = require('express');
const router = express.Router();
// middlewares
const { authCheck } = require('../middlewares/auth');
// controllers
const {
   userCart,
   getUserCart,
   emptyCart,
   saveAddress,
   applyCouponToUserCart,
   createOrder,
} = require('../controllers/user');

router.post('/user/cart', authCheck, userCart); // save cart
router.get('/user/cart', authCheck, getUserCart);
router.delete('/user/cart', authCheck, emptyCart);
router.post('/user/address', authCheck, saveAddress); // save cart

router.post('/user/order', authCheck, createOrder);

// coupon
router.post('/user/cart/coupon', authCheck, applyCouponToUserCart);

module.exports = router;
