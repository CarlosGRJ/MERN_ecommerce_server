const Sub = require('../models/sub');
const slugify = require('slugify');

exports.create = async (req, res) => {
   try {
      const { name, parent } = req.body;
      const sub = await new Sub({ name, parent, slug: slugify(name) }).save();

      res.json({ sub });
   } catch (error) {
      console.log('SUB CREATE ERR ---->', error);
      res.status(400).send('Create sub failed');
   }
};

exports.list = async (req, res) => {
   const sub = await Sub.find().sort({ createdAt: -1 }).exec();

   res.json({ sub });
};

exports.read = async (req, res) => {
   const sub = await Sub.findOne({ slug: req.params.slug }).exec();
   res.json({ sub });
};

exports.update = async (req, res) => {
   const { name } = req.body;

   try {
      const updated = await Sub.findOneAndUpdate(
         { slug: req.params.slug },
         { name, slug: slugify(name) },
         { new: true },
      );
      res.json({ updated });
   } catch (error) {
      console.log(error);
      res.status(400).send('Sub update failed');
   }
};

exports.remove = async (req, res) => {
   try {
      const deleted = await Sub.findOneAndDelete({
         slug: req.params.slug,
      });
      res.json({ deleted });
   } catch (error) {
      console.log(error);
      res.status(400).send('Category delete failed');
   }
};
