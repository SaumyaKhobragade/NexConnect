import Post from "../models/posts.model.js";
import User from "../models/users.model.js";
import Comment from "../models/comments.model.js";

export const createPost = async (req, res) => {
    try {
        const { body } = req.body;

        if (!body) {
            return res
                .status(400)
                .json({ message: "Post body is required" });
        }

        const post = new Post({
            userId: req.user._id,
            body,
            media: req.file ? req.file.filename : "",
            fileType: req.file ? req.file.mimetype : "",
        });

        await post.save();

        const populated = await post.populate(
            "userId",
            "name username profilePicture",
        );

        return res
            .status(201)
            .json({ message: "Post created", post: populated });
    } catch (err) {
        console.error("createPost error:", err);
        return res.status(500).json({ message: "Failed to create post" });
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const skip = (page - 1) * limit;

        const [posts, total] = await Promise.all([
            Post.find({ active: true })
                .populate("userId", "name username email profilePicture")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Post.countDocuments({ active: true }),
        ]);

        return res.status(200).json({
            posts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error("getAllPosts error:", err);
        return res.status(500).json({ message: "Failed to fetch posts" });
    }
};

export const getPost = async (req, res) => {
    try {
        const post = await Post.findOne({
            _id: req.params.postId,
            active: true,
        }).populate("userId", "name username email profilePicture");

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        return res.status(200).json({ post });
    } catch (err) {
        console.error("getPost error:", err);
        return res.status(500).json({ message: "Failed to fetch post" });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findOne({
            _id: req.params.postId,
            active: true,
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post.userId.toString() !== req.user._id.toString()) {
            return res
                .status(403)
                .json({ message: "Not authorized to delete this post" });
        }

        // Soft delete post, hard delete its comments
        post.active = false;
        await post.save();
        await Comment.deleteMany({ postId: post._id });

        return res.status(200).json({ message: "Post deleted" });
    } catch (err) {
        console.error("deletePost error:", err);
        return res.status(500).json({ message: "Failed to delete post" });
    }
};

export const likePost = async (req, res) => {
    try {
        const post = await Post.findOne({
            _id: req.params.postId,
            active: true,
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const userId = req.user._id;
        const alreadyLiked = post.likes.some(
            (id) => id.toString() === userId.toString(),
        );

        if (alreadyLiked) {
            return res
                .status(400)
                .json({ message: "Already liked this post" });
        }

        post.likes.push(userId);
        await post.save();

        return res
            .status(200)
            .json({ message: "Post liked", likesCount: post.likes.length });
    } catch (err) {
        console.error("likePost error:", err);
        return res.status(500).json({ message: "Failed to like post" });
    }
};

export const unlikePost = async (req, res) => {
    try {
        const post = await Post.findOne({
            _id: req.params.postId,
            active: true,
        });

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const userId = req.user._id;
        const likeIndex = post.likes.findIndex(
            (id) => id.toString() === userId.toString(),
        );

        if (likeIndex === -1) {
            return res.status(400).json({ message: "Not liked yet" });
        }

        post.likes.splice(likeIndex, 1);
        await post.save();

        return res
            .status(200)
            .json({ message: "Like removed", likesCount: post.likes.length });
    } catch (err) {
        console.error("unlikePost error:", err);
        return res.status(500).json({ message: "Failed to unlike post" });
    }
};
