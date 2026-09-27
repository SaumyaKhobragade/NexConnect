import multer from 'multer';

import {  Router } from 'express';
import { register, login, uploadProfilePicture } from '../controllers/users.controller.js';

const router = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

router.route("/upload_profile_picture").post(upload.single('profile_picture'), uploadProfilePicture);

router.post('/register', register);
router.post('/login', login);

export default router;
