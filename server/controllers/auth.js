const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate a JWT token
const generateToken = (id, role, secret, expiresIn) => {
    return jwt.sign({ id, role }, secret, { expiresIn });
};

// @desc      Register a new user
// @route     POST /api/auth/register
// @access    Public
exports.register = async (req, res) => {
    // Corrected: use `name` to match our User model
    const { name, email, password, role } = req.body;
    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create new user
        user = await User.create({ name, email, password, role });

        // Generate tokens using the new, descriptive env variables
        const accessToken = generateToken(
            user._id,
            user.role,
            process.env.JWT_ACCESS_SECRET,
            process.env.JWT_ACCESS_EXPIRES_IN
        );
        const refreshToken = generateToken(
            user._id,
            user.role,
            process.env.JWT_REFRESH_SECRET,
            process.env.JWT_REFRESH_EXPIRES_IN
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token: accessToken,
            refreshToken: refreshToken,
            user: {
                id: user._id,
                name: user.name, // Use `user.name` to be consistent with the database
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

// @desc      Login user
// @route     POST /api/auth/login
// @access    Public
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const accessToken = generateToken(
            user._id,
            user.role,
            process.env.JWT_ACCESS_SECRET,
            process.env.JWT_ACCESS_EXPIRES_IN
        );
        const refreshToken = generateToken(
            user._id,
            user.role,
            process.env.JWT_REFRESH_SECRET,
            process.env.JWT_REFRESH_EXPIRES_IN
        );

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token: accessToken,
            refreshToken: refreshToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
};