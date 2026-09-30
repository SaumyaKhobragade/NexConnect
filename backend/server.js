import dotenv from "dotenv";
dotenv.config();

import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import fs from "fs";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.route.js";
import postRoutes from "./routes/posts.route.js";
import commentRoutes from "./routes/comments.routes.js";
import connectionRoutes from "./routes/connections.routes.js";

// Ensure uploads directory exists
if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true,
    }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", commentRoutes);
app.use("/api/connections", connectionRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);

    // Multer file size errors
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ message: "File too large" });
    }

    // Multer file type errors
    if (err.message && err.message.includes("Only")) {
        return res.status(400).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 8000;

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error.message);
        process.exit(1);
    }
};

start();
