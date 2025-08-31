const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Define the routes for user authentication.
// These routes will hit the corresponding functions in our controller.

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
