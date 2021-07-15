const express = require('express');
const router = express.Router();
// middlewares
const { authCheck } = require('../middlewares/auth');
// controllers
const { userCart } = require('../controllers/user');


router.post('/cart', authCheck, userCart);  // save cart

// router.get('/user', (req, res) => {
//    res.json({
//       data: 'Hey you hit user API endpoint',
//    });
// });

module.exports = router;
