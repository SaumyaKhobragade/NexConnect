import bcryptjs from "bcryptjs";
import crypto from "crypto";

import User from "../models/users.model.js";
import Profile from "../models/profile.model.js";

export const register = async (req, res) => {
    try {
        const { name, email, password, username } = req.body;

        if (!name || !email || !password || !username) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res
                .status(400)
                .json({ message: "Password must be at least 6 characters" });
        }

        const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username: username.toLowerCase() },
            ],
        });

        if (existingUser) {
            const field =
                existingUser.email === email.toLowerCase()
                    ? "Email"
                    : "Username";
            return res
                .status(409)
                .json({ message: `${field} already in use` });
        }

        const hashedPassword = await bcryptjs.hash(password, 12);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username,
        });
        await newUser.save();

        const profile = new Profile({ userId: newUser._id });
        await profile.save();

        return res
            .status(201)
            .json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ message: "Registration failed" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!user.active) {
            return res
                .status(403)
                .json({ message: "Account is deactivated" });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = crypto.randomBytes(32).toString("hex");
        user.token = token;
        await user.save();

        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Login failed" });
    }
};

export const logout = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { token: "" });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
    }
};
