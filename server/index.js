// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;  

// Connect to MongoDB
connectDB();

// Enable CORS for all routes
app.use(cors({
  origin: [
    "http://localhost:5173",           // for local dev
    "https://store-mgmt.netlify.app/" // replace with your real Netlify domain
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware
app.use(express.json());

// API routes
app.use('/api', apiRoutes);

// Handle preflight requests for all routes
app.options('*', cors());

// Start the server
app.get('/', (req, res) => {
  res.send('Store Management API is running')
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
