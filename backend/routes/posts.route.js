import { Router } from "express";
import auth from "../middleware/auth.js";
import { postUpload } from "../middleware/upload.js";
import {
    createPost,
    getAllPosts,
    getPost,
    deletePost,
    likePost,
    unlikePost,
} from "../controllers/posts.controller.js";

const router = Router();

router.post("/", auth, postUpload.single("media"), createPost);
router.get("/", getAllPosts);
router.get("/:postId", getPost);
router.delete("/:postId", auth, deletePost);
router.post("/:postId/like", auth, likePost);
router.delete("/:postId/like", auth, unlikePost);

export default router;
