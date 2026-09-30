import multer from "multer";
import crypto from "crypto";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        // Unique filename prevents collisions between users
        const uniqueName =
            crypto.randomBytes(16).toString("hex") +
            path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const imageFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext) && /image\//.test(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only image files (jpeg, jpg, png, gif, webp) are allowed",
            ),
            false,
        );
    }
};

const mediaFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|pdf/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file type"), false);
    }
};

export const profileUpload = multer({
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const postUpload = multer({
    storage,
    fileFilter: mediaFilter,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});
