const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
   {
      title: {
         type: String,
         trim: true,
         required: true,
         maxLength: 32,
         text: true,
      },
      slug: {
         type: String,
         unique: true,
         lowercase: true,
         index: true,
      },
      price: {
         type: Number,
         required: true,
         trim: true,
         text: true,
         maxLength: 32,
      },
      category: {
         type: ObjectId,
         ref: 'Category',
      },
      subs: [
         {
            type: ObjectId,
            ref: 'Sub',
         },
      ],
      quantity: Number,
      sold: {
         type: Number,
         default: 0,
      },
      images: {
         type: Array,
      },
      shipping: {
         type: String,
         enum: ['Yes', 'No'],
      },
      color: {
         type: String,
         enum: ['Black', 'Brown', 'Silver', 'White', 'Blue'], // Valores Permitidos
      },
      brand: {
         type: String,
         enum: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'ASUS'], // Valores Permitidos
      },
      //   ratings: [
      //      {
      //         star: Number,
      //         postedBy: { type: ObjectId, ref: 'User' },
      //      },
      //   ],
   },
   { timestamps: true },
);

module.exports = mongoose.model('Product', productSchema);
