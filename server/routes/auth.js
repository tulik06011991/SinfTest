const express = require('express');
const { registerUser, loginUser } = require('../auth/auth');
const middleware = require('../middleware/middleware')

const router = express.Router();

// Ro'yxatdan o'tish (POST /api/users/register)
router.post('/register',  registerUser);

// Kirish (POST /api/users/login)
router.post('/login',  loginUser);

module.exports = router;
