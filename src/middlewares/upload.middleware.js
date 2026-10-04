import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "project-01/users",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
});

export const uploadUserImage = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});