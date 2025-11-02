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

// CORS config — apply before routes so OPTIONS/preflight get handled
const allowedOrigins = [
    "https://store-mgmt.netlify.app",
    "http://localhost:5173",
    "https://store-management-eosin.vercel.app" // allow your deployed server if needed
];

const corsOptions = {
    origin: function (origin, callback) {
        // allow requests with no origin (like server-to-server or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Body parser
app.use(express.json());

// Connect to MongoDB (safe to call now)
connectDB();

// Routes
app.use("/api", apiRoutes);
app.use("/api/auth", authRoutes);

// Start server when running locally, but export app for Vercel serverless
if (require.main === module) {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
} else {
    module.exports = app;
}