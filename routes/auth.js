const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// import
const { createOrUpdateUser } = require('../controllers/auth');


router.get('/create-or-update-user', createOrUpdateUser);

module.exports = router;
