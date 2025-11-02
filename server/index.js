// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');


const app = express();
const PORT = process.env.PORT || 5000;  


// Connect to MongoDB
connectDB();


// Enable CORS for all routes
app.use(cors());


// Middleware
app.use(express.json());


// API routes
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);


// Handle preflight requests for all routes
app.options('*', cors());


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});