import Comment from "../models/comments.model.js";
import Post from "../models/posts.model.js";

export const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { body } = req.body;

        if (!body) {
            return res
                .status(400)
                .json({ message: "Comment body is required" });
        }

        const post = await Post.findOne({ _id: postId, active: true });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = new Comment({
            userId: req.user._id,
            postId,
            body,
        });

        await comment.save();

        const populated = await comment.populate(
            "userId",
            "name username profilePicture",
        );

        return res
            .status(201)
            .json({ message: "Comment added", comment: populated });
    } catch (err) {
        console.error("addComment error:", err);
        return res.status(500).json({ message: "Failed to add comment" });
    }
};

export const getComments = async (req, res) => {
    try {
        const { postId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const skip = (page - 1) * limit;

        const [comments, total] = await Promise.all([
            Comment.find({ postId })
                .populate("userId", "name username profilePicture")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Comment.countDocuments({ postId }),
        ]);

        return res.status(200).json({
            comments,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error("getComments error:", err);
        return res
            .status(500)
            .json({ message: "Failed to fetch comments" });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        if (comment.userId.toString() !== req.user._id.toString()) {
            return res
                .status(403)
                .json({ message: "Not authorized to delete this comment" });
        }

        await Comment.findByIdAndDelete(commentId);
        return res.status(200).json({ message: "Comment deleted" });
    } catch (err) {
        console.error("deleteComment error:", err);
        return res
            .status(500)
            .json({ message: "Failed to delete comment" });
    }
};
