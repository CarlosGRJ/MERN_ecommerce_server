const admin = require('../firebase/index');

exports.authCheck = async (req, res, next) => {
   try {
      const firebaseUser = await admin
         .auth()
         .verifyIdToken(req.headers.authtoken);
      console.log('FIREBASE USER IN AUTHCHECK ', firebaseUser);
      req.user = firebaseUser;
      next();
   } catch (error) {
      res.status(401).json({
         error: 'Invalid or expired token',
      });
   }
};
