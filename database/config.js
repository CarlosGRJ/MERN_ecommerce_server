const mongoose = require('mongoose');

const dbConnection = async () => {
   try {
      await mongoose.connect(process.env.DATABASE, {
         useNewUrlParser: true,
         useFindAndModify: false,
         useUnifiedTopology: true,
         useCreateIndex: true,
      });

      console.log('DB Online');
   } catch (error) {
      console.log(error);
      throw new Error('Error a la hora de iniciar la BD ver logs');
   }
};

module.exports = {
   dbConnection,
};
