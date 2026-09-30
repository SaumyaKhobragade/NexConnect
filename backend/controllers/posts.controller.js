import Post from "../models/posts.model.js";
import Comment from "../models/comments.model.js";

const createPost = async (req, res) => {
    const { token } = req.body;
    try {
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const post = new Post({
            user: user._id,
            body: req.body.body,
            media: req.file ? req.file.path : "",
            filetype: req.file ? req.file.mimetype : "",
        });

        await post.save();
        res.status(201).json({ message: "Post created successfully" });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("user", "username email");

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deletePost = async (req, res) => {
    const { token, postId } = req.body;

    try {
        const user = await User.findOne({ token }).select("_id");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.user.toString() !== user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this post",
            });
        }

        await Post.findByIdAndDelete(postId);
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const commentPost = async (req, res) => {
    const { token, postId, commentBody } = req.body;

    try {
        const user = await User.findOne({ token }).select("_id");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = new Comment({
            user: user._id,
            post: postId,
            comment: commentBody,
        });

        await comment.save();
        res.status(201).json({ message: "Comment added successfully" });
    } catch (error) {
        console.error("Error commenting on post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const get_comments_by_post = async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await Comment.find({ post: postId }).populate(
            "user",
            "username email",
        );

        res.status(200).json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const delete_comment_of_user = async (req, res) => {
    const { token, commentId } = req.body;

    try {
        const user = await User.findOne({ token }).select("_id");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.user.toString() !== user._id.toString()) {
            return res.status(403).json({
                message: "You are not authorized to delete this comment",
            });
        }

        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error deleting comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const implement_likes = async (req, res) => {
    const { token, postId } = req.body;

    try {
        const user = await User.findOne({ token }).select("_id");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.likes += 1;

        await post.save();
        res.status(200).json({ message: "Post liked successfully" });
    } catch (error) {
        console.error("Error liking/unliking post:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export {
    createPost,
    getAllPosts,
    deletePost,
    commentPost,
    get_comments_by_post,
    delete_comment_of_user,
    implement_likes,
};
