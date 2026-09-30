import PDFDocument from "pdfkit";

import User from "../models/users.model.js";
import Profile from "../models/profile.model.js";

export const getMe = async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user._id });

        return res.status(200).json({
            user: req.user,
            profile: profile || null,
        });
    } catch (err) {
        console.error("getMe error:", err);
        return res.status(500).json({ message: "Failed to fetch profile" });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { name, username, email } = req.body;
        const updates = {};

        if (name !== undefined) updates.name = name;
        if (username !== undefined) updates.username = username.toLowerCase();
        if (email !== undefined) updates.email = email.toLowerCase();

        // Check uniqueness if username or email is changing
        if (username || email) {
            const conditions = [];
            if (username) conditions.push({ username: username.toLowerCase() });
            if (email) conditions.push({ email: email.toLowerCase() });

            const existingUser = await User.findOne({
                $or: conditions,
                _id: { $ne: req.user._id },
            });

            if (existingUser) {
                const field =
                    existingUser.username === username?.toLowerCase()
                        ? "Username"
                        : "Email";
                return res
                    .status(409)
                    .json({ message: `${field} already in use` });
            }
        }

        const user = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true,
        }).select("-password -token");

        return res.status(200).json({ message: "User updated", user });
    } catch (err) {
        console.error("updateUser error:", err);
        return res.status(500).json({ message: "Update failed" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { bio, currentPost, pastWork, education } = req.body;
        const updates = {};

        if (bio !== undefined) updates.bio = bio;
        if (currentPost !== undefined) updates.currentPost = currentPost;
        if (pastWork !== undefined) updates.pastWork = pastWork;
        if (education !== undefined) updates.education = education;

        const profile = await Profile.findOneAndUpdate(
            { userId: req.user._id },
            updates,
            { new: true, runValidators: true },
        );

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        return res.status(200).json({ message: "Profile updated", profile });
    } catch (err) {
        console.error("updateProfile error:", err);
        return res.status(500).json({ message: "Profile update failed" });
    }
};

export const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { profilePicture: req.file.filename },
            { new: true },
        ).select("-password -token");

        return res.status(200).json({
            message: "Profile picture uploaded",
            profilePicture: user.profilePicture,
        });
    } catch (err) {
        console.error("uploadProfilePicture error:", err);
        return res.status(500).json({ message: "Upload failed" });
    }
};

export const getAllProfiles = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const skip = (page - 1) * limit;

        const [profiles, total] = await Promise.all([
            Profile.find()
                .populate("userId", "name username email profilePicture")
                .skip(skip)
                .limit(limit),
            Profile.countDocuments(),
        ]);

        return res.status(200).json({
            profiles,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error("getAllProfiles error:", err);
        return res.status(500).json({ message: "Failed to fetch profiles" });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select("-password -token");
        if (!user || !user.active) {
            return res.status(404).json({ message: "User not found" });
        }

        const profile = await Profile.findOne({ userId });

        return res.status(200).json({ user, profile: profile || null });
    } catch (err) {
        console.error("getUserById error:", err);
        return res.status(500).json({ message: "Failed to fetch user" });
    }
};

export const downloadResume = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select("-password -token");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const profile = await Profile.findOne({ userId });
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // Stream PDF directly to response (no temp file on disk)
        const doc = new PDFDocument();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${user.name.replace(/\s+/g, "_")}_resume.pdf"`,
        );

        doc.pipe(res);

        // Header
        doc.fontSize(24).text(user.name, { align: "center" });
        doc.fontSize(12).text(user.email, { align: "center" });
        doc.fontSize(12).text(`@${user.username}`, { align: "center" });
        doc.moveDown();

        // Bio
        if (profile.bio) {
            doc.fontSize(16).text("About", { underline: true });
            doc.fontSize(12).text(profile.bio);
            doc.moveDown();
        }

        // Current Position
        if (profile.currentPost) {
            doc.fontSize(16).text("Current Position", { underline: true });
            doc.fontSize(12).text(profile.currentPost);
            doc.moveDown();
        }

        // Work Experience
        if (profile.pastWork && profile.pastWork.length > 0) {
            doc.fontSize(16).text("Work Experience", { underline: true });
            profile.pastWork.forEach((work) => {
                doc.fontSize(14).text(work.company, { continued: true });
                doc.fontSize(12).text(
                    ` — ${work.position} (${work.years} years)`,
                );
            });
            doc.moveDown();
        }

        // Education
        if (profile.education && profile.education.length > 0) {
            doc.fontSize(16).text("Education", { underline: true });
            profile.education.forEach((edu) => {
                doc.fontSize(14).text(edu.school, { continued: true });
                doc.fontSize(12).text(
                    ` — ${edu.degree} in ${edu.fieldOfStudy}`,
                );
            });
        }

        doc.end();
    } catch (err) {
        console.error("downloadResume error:", err);
        // Only send JSON error if headers haven't been sent yet
        if (!res.headersSent) {
            return res
                .status(500)
                .json({ message: "Resume generation failed" });
        }
    }
};
