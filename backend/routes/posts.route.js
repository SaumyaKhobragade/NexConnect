import {  Router } from 'express';
import { activeCheck } from '../controllers/posts.controller.js';

const router = Router();

// Define your post routes here
router.get('/', (req, res) => {
    activeCheck(req, res);
});

export default router;
