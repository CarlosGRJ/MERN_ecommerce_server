const Coupon = require('../models/coupon');

exports.create = async (req, res) => {
   try {
      const { name, expiry, discount } = req.body;
      const newCoupon = await new Coupon({ name, expiry, discount }).save();
      res.json(newCoupon);
   } catch (error) {
      console.log(error);
   }
};

exports.remove = async (req, res) => {
   const couponId = req.params.couponId;
   try {
      const couponRemoved = await Coupon.findByIdAndDelete(couponId).exec();
      res.json(couponRemoved);
   } catch (error) {
      console.log(error);
   }
};

exports.list = async (req, res) => {
   try {
      const coupons = await Coupon.find({}).sort({ createdAt: -1 }).exec();
      res.json(coupons);
   } catch (error) {
      console.log(error);
   }
};
