const { Schema, model } = require('mongoose');

const CategorySchema = new Schema(
   {
      name: {
         type: String,
         trim: true,
         required: [true, 'Name is required'],
         minlength: [2, 'Too short'],
         maxlength: [32, 'Too long'],
      },
      slug: {
         type: String,
         unique: true,
         lowercase: true,
         index: true,
      },
   },
   { timestamps: true },
);

module.exports = model('Category', CategorySchema);
