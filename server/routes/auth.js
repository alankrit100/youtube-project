const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth');
const rateLimit = require('express-rate-limit');

// Rate limiting middleware for login to prevent brute force attacks
const loginLimiter = rateLimit({
    windowMs: 3 * 60 * 1000, // 3 minutes
    max: 100, // Max 100 requests per 15 minutes per IP
    message: 'Too many login attempts from this IP, please try again after 3 minutes'
});

// @desc      Register a new user
// @route     POST /api/auth/register
// @access    Public
router.post('/register', register);

// @desc      Login a user
// @route     POST /api/auth/login
// @access    Public
router.post('/login', loginLimiter, login);

module.exports = router;