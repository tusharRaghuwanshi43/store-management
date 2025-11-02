if (process.env.NODE_ENV !== "production") {
require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const apiRoutes = require("./routes/api");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Enable CORS
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", apiRoutes);
app.use("/api/auth", authRoutes);

// Preflight
app.options("*", cors());

// Start server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
