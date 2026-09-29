import bcryptjs from "bcryptjs";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";

import User from "../models/users.model.js";
import Profile from "../models/profile.model.js";

const convertUserDataToPDF = async (userData) => {
    const doc = new PDFDocument();
    
    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
    const stream = doc.pipe(require("fs").createWriteStream(outputPath));

    doc.image(`uploads/${userData.userId.profilePicture}`, { width: 100, align: "center" });
    doc.fontSize(20).text("Name: " + userData.name, { align: "center" });
    doc.fontSize(16).text("Email: " + userData.email, { align: "center" });
    doc.fontSize(16).text("Username: " + userData.username, { align: "center" });
    doc.fontSize(16).text("Bio: " + userData.bio, { align: "center" });
    doc.fontSize(16).text("Current Position: " + userData.position, { align: "center" });

    doc.fontSize(16).text("Past Work: ");
    userData.pastWork.forEach((work, index) => {
        doc.fontsize(14).text("Company Name: " + work.company, { align: "left" });
        doc.fontSize(14).text("Position: " + work.position, { align: "left" });
        doc.fontSize(14).text("Years: " + work.years, { align: "left" });
    });

    doc.end();

    return outputPath;
};

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
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username,
        });
        await newUser.save();

        const profile = new Profile({ user: newUser._id });

        await profile.save();

        return res
            .status(201)
            .json({ message: "User registered successfully" });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

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
};

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

        return res.status(200).json({
            message: "Profile picture uploaded successfully",
            profilePicture: user.profilePicture,
        });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

const updateUserProfile = async (req, res) => {
    const { token, ...updateData } = req.body;

    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { username, email } = updateData;

        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });

        if (
            existingUser &&
            existingUser._id.toString() !== user._id.toString()
        ) {
            return res
                .status(400)
                .json({ message: "Username or email already in use" });
        }

        Object.assign(user, updateData);

        await user.save();

        return res
            .status(200)
            .json({ message: "Profile updated successfully", user });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

const getUserAndProfile = async (req, res) => {
    const token = req.body.token;

    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const profile = await Profile.findOne({ user: user._id }).populate(
            "user",
            "name email username profilePicture",
        );
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        return res.status(200).json({ user, profile });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

const updateProfileData = async (req, res) => {
    const { token, ...updateData } = req.body;

    try {
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const profile = await Profile.findOne({ user: user._id });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        Object.assign(profile, updateData);
        await profile.save();

        return res
            .status(200)
            .json({ message: "Profile data updated successfully", profile });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

const getAllUserProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find().populate(
            "user",
            "name email username profilePicture",
        );
        return res.status(200).json({ profiles });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

const downloadResume = async (req, res) => {
    const user_id = req.query.userId;

    try {
        const user = await User.findOne({ _id: user_id }).populate(
            "user",
            "name email username profilePicture",
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let outputPath = await convertUserDataToPDF(user);

        return res
            .status(200)
            .json({ message: "Resume downloaded successfully", resume: outputPath });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
};

export {
    register,
    login,
    uploadProfilePicture,
    updateUserProfile,
    getUserAndProfile,
    updateProfileData,
    getAllUserProfiles,
    downloadResume,
};
