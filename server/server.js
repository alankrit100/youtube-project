require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;
const path = require('path');

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully.');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
connectDB();

// === Route Imports ===
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users'); // Note: This file will be created later
const projectRoutes = require('./routes/projects');
const videoRoutes = require('./routes/videos');


// === Route Mounting ===
// This is the correct line for our authentication routes
app.use('/api/auth', authRoutes);
// We will mount the users route here later, but for now we'll comment it out
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/videos', videoRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is running' });
});

app.get('/', (req, res) => {
    res.send('Welcome to the Youtube Mediator API!!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});