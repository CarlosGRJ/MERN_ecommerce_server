const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/user', (req, res) => {
   res.json({
      data: 'Hey you hit user API endpoint',
   });
});

module.exports = router;
