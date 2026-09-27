import bcryptjs from "bcryptjs";
import crypto from "crypto";

import User from "../models/users.model.js";
import Profile from "../models/profile.model.js";

const register = async (req, res) => {
    try {
        const { name, email, password, username } = req.body;

        if (!name || !email || !password || !username) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userExists = await User.findOne({ email });
        
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, username });
        await newUser.save();
        
        const profile = new Profile({ user: newUser._id });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = crypto.randomBytes(32).toString("hex");
        await User.findByIdAndUpdate(user._id, { token });

        return res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
}


const uploadProfilePicture = async (req, res) => {
    const token = req.body.token;

    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        user.profilePicture = req.file.path;
        await user.save();

        return res.status(200).json({ message: "Profile picture uploaded successfully", profilePicture: user.profilePicture });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

export { register, login, uploadProfilePicture };
