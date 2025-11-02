// server.js 
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');


const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Enable CORS for Netlify + local
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://store-mgmt.netlify.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);


// Root endpoint
app.get('/', (req, res) => {
  res.send('Store Management API is running');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
