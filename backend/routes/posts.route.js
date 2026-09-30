import multer from 'multer';

import { Router } from 'express';
import { createPost, getAllPosts, deletePost, commentPost, get_comments_by_post, delete_comment_of_user, implement_likes } from '../controllers/posts.controller.js';

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

router.route('/').post(upload.single('image'), createPost);
router.get('/', getAllPosts);
router.delete('/:postId', deletePost);
router.post('/:postId/comment', commentPost);
router.get('/:postId/comment', get_comments_by_post);
router.delete('/:postId/comment', delete_comment_of_user);
router.post('/:postId/like', implement_likes);

export default router;
