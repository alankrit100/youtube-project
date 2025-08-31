const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./src/routes/authRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables from .env file
dotenv;

// Connect to MongoDB
connectDB();

// Initialize the Express application
const app = express();

// Middleware to parse JSON and URL-encoded data from incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mount our authentication routes.
// All authentication-related endpoints will now be under the /api/users path.
app.use('/api/users', authRoutes);

// Use our custom error handler middleware.
// This must be placed at the end of all our routes to catch all errors.
app.use(errorHandler);

// Define a port for the server to listen on.
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});