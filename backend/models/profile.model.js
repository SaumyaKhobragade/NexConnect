import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
    school: {
        type: String,
        required: true,
        default: "",
    },
    degree: {
        type: String,
        required: true,
        default: "",
    },
    fieldOfStudy: {
        type: String,
        required: true,
        default: "",
    },
});

const workSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
        default: "",
    },
    position: {
        type: String,
        required: true,
        default: "",
    },
    years: {
        type: Number,
        required: true,
        default: 0,
    },
});

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    bio: {
        type: String,
        default: "",
    },
    currentPost: {
        type: String,
        default: "",
    },
    pastWork: {
        type: [workSchema],
        default: [],
    },
    education: {
        type: [educationSchema],
        default: [],
    },
});