const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
// @desc      Get all users
// @route     GET /api/users/me
// @access    Private

router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ success: true, user});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({error: 'Server Error'});
    }   
});

module.exports = router;