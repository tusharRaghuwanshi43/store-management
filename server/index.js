if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

console.log("🔍 Loaded Environment Variables:");
console.log("MONGO_URI:", !!process.env.MONGO_URI);
console.log("JWT_SECRET:", !!process.env.JWT_SECRET);
console.log("NODE_ENV:", process.env.NODE_ENV);

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
const allowedOrigins = [
    "https://store-mgmt.netlify.app",
    "http://localhost:5173" // optional, for local dev
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.options("*", cors());


// Start server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
