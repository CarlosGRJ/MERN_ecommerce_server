const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Coupon = require('../models/coupon');

exports.userCart = async (req, res) => {
   //    console.log('BODY ===> ', req.body);
   const { cart } = req.body;

   let products = [];

   const user = await User.findOne({ email: req.user.email }).exec();

   // Check if cart with logged in user id already exist
   let cartExistByThisUser = await Cart.findOne({ orderedBy: user._id }).exec();
   //    console.log('cartExistByThisUser ---> ', cartExistByThisUser);

   if (cartExistByThisUser) {
      cartExistByThisUser.remove();
      console.log('removed old cart');
   }

   for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i]._id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      // get price for creating total
      let productFromDb = await Product.findById(cart[i]._id)
         .select('price')
         .exec();
      object.price = productFromDb.price;

      products.push(object);
   }
   //    console.log('products ---> ', products);
   let cartTotal = 0;
   for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
   }
   //    console.log('cartTotal ', cartTotal);

   const newCart = await new Cart({
      products,
      cartTotal,
      orderedBy: user._id,
   }).save();

   //    console.log('newCart ', newCart);
   res.json({ ok: true });
};

exports.getUserCart = async (req, res) => {
   const user = await User.findOne({ email: req.user.email }).exec();

   let cart = await Cart.findOne({ orderedBy: user._id })
      .populate('products.product', '_id title price totalAfterDiscount')
      .exec();
   const { products, cartTotal, totalAfterDiscount } = cart;
   res.json({ products, cartTotal, totalAfterDiscount });
};

exports.emptyCart = async (req, res) => {
   const user = await User.findOne({ email: req.user.email }).exec();
   const cart = await Cart.findOneAndRemove({ orderedBy: user._id }).exec();
   res.json(cart);
};

exports.saveAddress = async (req, res) => {
   const userAddress = await User.findOneAndUpdate(
      { email: req.user.email },
      { address: req.body.address },
   ).exec();
   res.json({ ok: true });
};

exports.applyCouponToUserCart = async (req, res) => {
   const { coupon } = req.body;
   console.log('COUPON', coupon);

   const validCoupon = await Coupon.findOne({ name: coupon }).exec();
   if (validCoupon === null) {
      return res.json({
         err: 'Invalid coupon',
      });
   }
   console.log('validCoupon ', validCoupon);
   const user = await User.findOne({ email: req.user.email }).exec();

   let { products, cartTotal } = await Cart.findOne({
      orderBy: user._id,
   })
      .populate('products.product', '_id title price')
      .exec();
   console.log('cartTotal ', cartTotal, 'discount %', validCoupon.discount);

   // Calculate the total after discount
   const totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
   ).toFixed(2); // 99.99

   Cart.findOneAndUpdate(
      { orderBy: user._id },
      { totalAfterDiscount },
      { new: true },
   );

   res.json(totalAfterDiscount)
};
