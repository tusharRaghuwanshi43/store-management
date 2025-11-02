require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db'); // change path for api folder
const apiRoutes = require('../routes/api');
const authRoutes = require('../routes/auth');

const app = express();

// Connect to MongoDB (make sure your db connection code is friendly for serverless)
connectDB();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

// Preflight for all
app.options('*', cors());

// IMPORTANT: DO NOT CALL app.listen!
// Export the app for Vercel serverless
module.exports = app;
