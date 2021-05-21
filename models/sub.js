const { Schema, model } = require('mongoose');
const { ObjectId } = Schema;

const subSchema = new Schema(
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
      parent: {
         type: ObjectId,
         ref: 'Category',
         required: true,
      },
   },
   { timestamps: true },
);

module.exports = model('Sub', subSchema);
