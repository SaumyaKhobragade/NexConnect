import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePicture: {
            type: String,
            default: "default.jpg",
        },
        active: {
            type: Boolean,
            default: true,
        },
        token: {
            type: String,
            default: "",
        },
    },
    { timestamps: true },
);

// Fast lookup for auth middleware (runs on every authenticated request)
userSchema.index({ token: 1 });

const User = mongoose.model("User", userSchema);

export default User;
