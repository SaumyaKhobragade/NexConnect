import multer from "multer";

import { Router } from "express";
import {
    register,
    login,
    uploadProfilePicture,
    getUserAndProfile,
    updateProfileData,
    getAllUserProfiles,
    downloadResume,
} from "../controllers/users.controller.js";

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

router
    .route("/upload_profile_picture")
    .post(upload.single("profile_picture"), uploadProfilePicture);

router.post("/register", register);
router.post("/login", login);
router.post("/user_update", updateUserProfile);
router.get("/get_user_and_profile", getUserAndProfile);
router.post("/update_profile_data", updateProfileData);
router.get("/get_all_user_profiles", getAllUserProfiles);
router.get("/download_resume", downloadResume);

export default router;
