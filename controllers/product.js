const Product = require('../models/product');
const User = require('../models/user');
const slugify = require('slugify');

exports.create = async (req, res) => {
   try {
      console.log(req.body);
      req.body.slug = slugify(req.body.title);
      const newProduct = await new Product(req.body).save();
      res.json(newProduct);
   } catch (err) {
      console.log(err);
      // res.status(400).send('Create product failed');
      res.status(400).json({
         err: err.message,
      });
   }
};

exports.listAll = async (req, res) => {
   const products = await Product.find({})
      .limit(parseInt(req.params.count))
      .populate('category')
      .populate('subs')
      .sort([['createdAt', 'desc']])
      .exec();
   res.json(products);
};

exports.remove = async (req, res) => {
   try {
      const deleted = await Product.findOneAndRemove({
         slug: req.params.slug,
      }).exec();
      res.json(deleted);
   } catch (error) {
      console.log(error);
      return res.status(400).send('Product delete failed');
   }
};

exports.read = async (req, res) => {
   const product = await Product.findOne({ slug: req.params.slug })
      .populate('category')
      .populate('subs')
      .exec();
   res.json(product);
};

exports.update = async (req, res) => {
   try {
      if (req.body.title) {
         req.body.slug = slugify(req.body.title);
      }
      const updated = await Product.findOneAndUpdate(
         { slug: req.params.slug },
         req.body,
         { new: true },
      ).exec();
      res.json(updated);
   } catch (error) {
      console.log('PRODUCT UPDATE ERROR ----> ', error);
      // return res.status(400).send('Product update failed');
      res.status(400).json({
         err: err.message,
      });
   }
};

// WITHOUT PAGINATION
// exports.list = async (req, res) => {
//    try {
//       // createdAt/updatedAt, desc/asc
//       const { sort, order, limit } = req.body;
//       const products = await Product.find({})
//          .populate('category')
//          .populate('subs')
//          .sort([[sort, order]])
//          .limit(limit)
//          .exec();

//       res.json(products);
//    } catch (error) {
//       console.log(error);
//    }
// };

// WITH PAGINATION
exports.list = async (req, res) => {
   try {
      // createdAt/updatedAt, desc/asc
      const { sort, order, page } = req.body;
      const currentPage = page || 1;
      const perPage = 3;

      const products = await Product.find({})
         .skip((currentPage - 1) * perPage)
         .populate('category')
         .populate('subs')
         .sort([[sort, order]])
         .limit(perPage)
         .exec();

      res.json(products);
   } catch (error) {
      console.log(error);
   }
};

exports.productsCount = async (req, res) => {
   const total = await Product.find({}).estimatedDocumentCount().exec();
   res.json(total);
};

exports.productStart = async (req, res) => {
   const product = await Product.findById(req.params.productId).exec();
   const user = await User.findOne({ email: req.user.email }).exec();
   const { star } = req.body;

   // who is updating
   // check if currently logged in user have already added rating to this product
   const existingRatingObject = product.ratings.find(
      (ele) => ele.postedBy.toString() === user._id.toString(),
   );

   // If user haven´t left rating yet, push it
   if (existingRatingObject === undefined) {
      let ratingAdded = await Product.findByIdAndUpdate(
         product._id,
         {
            $push: { ratings: { star, postedBy: user._id } },
         },
         { new: true },
      ).exec();
      console.log('ratingAdded', ratingAdded);
      res.json(ratingAdded);
   } else {
      // If user have already left rating, update it
      const ratingUpdated = await Product.updateOne(
         { ratings: { $elemMatch: existingRatingObject } },
         { $set: { 'ratings.$.star': star } },
         { new: true },
      ).exec();
      console.log('ratingUpdated ', ratingUpdated);
      res.json(ratingUpdated);
   }
};

exports.listRelated = async (req, res) => {
   const productId = req.params.productId;
   const product = await Product.findById(productId).exec();

   const related = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
   })
      .limit(3)
      .populate('category')
      .populate('subs')
      .populate('ratings.postedBy')
      .exec();

   res.json(related);
};

// SEARCH / FILTER

const handleQuery = async (req, res, query) => {
   const products = await Product.find({
      $text: { $search: query },
   })
      .populate('category', '_id name')
      .populate('subs', '_id name')
      .populate('ratings.postedBy', '_id name')
      .exec();

   res.json(products);
};

const handlePrice = async (req, res, price) => {
   try {
      const products = await Product.find({
         price: {
            $gte: price[0],
            $lte: price[1],
         },
      })
         .populate('category', '_id name')
         .populate('subs', '_id name')
         .populate('ratings.postedBy', '_id name')
         .exec();

      res.json(products);
   } catch (error) {
      console.log(error);
   }
};

const handleCategory = async (req, res, category) => {
   try {
      const products = await Product.find({ category })
         .populate('category', '_id name')
         .populate('subs', '_id name')
         .populate('ratings.postedBy', '_id name')
         .exec();

      res.json(products);
   } catch (error) {
      console.log(error);
   }
};

const handleStar = (req, res, stars) => {
   Product.aggregate([
      {
         $project: {
            document: '$$ROOT',
            // title: "$title"
            floorAverage: {
               $floor: { $avg: '$ratings.star' }, // 3.33 floor to 3
            },
         },
      },
      {
         $match: { floorAverage: stars },
      },
   ])
      .limit(12)
      .exec((err, aggregates) => {
         if (err) console.log('AGGREGATE ERROR', err);

         // console.log('aggregates -> ', aggregates);
         Product.find({ _id: aggregates })
            .populate('category', '_id name')
            .populate('subs', '_id name')
            .populate('ratings.postedBy', '_id name')
            .exec((err, products) => {
               if (err) console.log('PRODUCT AGGREGATE ERROR', err);
               res.json(products);
            });
      });
};

const handleSub = async (req, res, sub) => {
   const products = await Product.find({ subs: sub })
      .populate('category', '_id name')
      .populate('subs', '_id name')
      .populate('ratings.postedBy', '_id name')
      .exec();
   res.json(products);
};

exports.searchFilters = async (req, res) => {
   const { query, price, category, stars, sub } = req.body;

   if (query) {
      console.log('query --->', query);
      await handleQuery(req, res, query);
   }

   // price [20, 200]  example body.price
   if (price !== undefined) {
      console.log('price ---> ', price);
      await handlePrice(req, res, price);
   }

   if (category) {
      console.log('category ---> ', category);
      await handleCategory(req, res, category);
   }

   if (stars) {
      console.log('stars ---> ', stars);
      await handleStar(req, res, stars);
   }

   if (sub) {
      console.log('sub --->', sub);
      await handleSub(req, res, sub);
   }
};
