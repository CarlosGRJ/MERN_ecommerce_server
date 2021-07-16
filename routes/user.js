const express = require('express');
const router = express.Router();
// middlewares
const { authCheck } = require('../middlewares/auth');
// controllers
const { userCart, getUserCart, emptyCart } = require('../controllers/user');

router.post('/user/cart', authCheck, userCart); // save cart
router.get('/user/cart', authCheck, getUserCart);
router.delete('/user/cart', authCheck, emptyCart);

// router.get('/user', (req, res) => {
//    res.json({
//       data: 'Hey you hit user API endpoint',
//    });
// });

module.exports = router;
