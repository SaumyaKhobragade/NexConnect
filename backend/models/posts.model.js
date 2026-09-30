import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        media: {
            type: String,
            default: "",
        },
        fileType: {
            type: String,
            default: "",
        },
        active: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
);

// Feed query: active posts sorted by newest first
postSchema.index({ active: 1, createdAt: -1 });

const Post = mongoose.model("Post", postSchema);

export default Post;
