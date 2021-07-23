const { Schema, model } = require('mongoose');
const { ObjectId } = Schema;

const UserSchema = new Schema(
   {
      name: String,
      email: {
         type: String,
         required: true,
         index: true,
      },
      role: {
         type: String,
         default: 'subscriber',
      },
      cart: {
         type: Array,
         default: [],
      },
      address: String,
      wishlist: [{ type: ObjectId, ref: 'Product' }],
   },
   { timestamps: true },
);

module.exports = model('User', UserSchema);
