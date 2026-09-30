import { Router } from "express";
import auth from "../middleware/auth.js";
import {
    addComment,
    getComments,
    deleteComment,
} from "../controllers/comments.controller.js";

const router = Router();

// Nested under posts for context
router.post("/posts/:postId/comments", auth, addComment);
router.get("/posts/:postId/comments", getComments);

// Top-level for direct comment operations
router.delete("/comments/:commentId", auth, deleteComment);

export default router;
