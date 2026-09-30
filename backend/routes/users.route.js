import { Router } from "express";
import auth from "../middleware/auth.js";
import { profileUpload } from "../middleware/upload.js";
import {
    getMe,
    updateUser,
    updateProfile,
    uploadProfilePicture,
    getAllProfiles,
    getUserById,
    downloadResume,
} from "../controllers/users.controller.js";

const router = Router();

// Authenticated routes (current user)
router.get("/me", auth, getMe);
router.put("/me", auth, updateUser);
router.put("/me/profile", auth, updateProfile);
router.post(
    "/me/profile-picture",
    auth,
    profileUpload.single("profilePicture"),
    uploadProfilePicture,
);

// Public routes
router.get("/", getAllProfiles);
router.get("/:userId", getUserById);
router.get("/:userId/resume", downloadResume);

export default router;
