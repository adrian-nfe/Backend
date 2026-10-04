import express from 'express';
import {
    register,
    login,
    getUsers,
    getUserById,
    updateUser,
    changeRole,
    deleteUser,
    addFavoriteBook,
    removeFavoriteBook,
} from '../controllers/user.controller.js';
import { uploadUserImage } from '../middlewares/upload.middleware.js';
import { auth } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/role.middleware.js';

const router = express.Router();

router.post("/register", uploadUserImage.single("image"), register);
router.post("/login", login);
router.get("/", auth, getUsers);
router.get("/:id", auth, getUserById);
router.put("/:id", auth, uploadUserImage.single("image"), updateUser);
router.delete("/:id", auth, deleteUser);
router.patch("/:id/role", auth, isAdmin, changeRole);
router.post("/me/favorites", auth, addFavoriteBook);
router.delete("/me/favorites/:bookId", auth, removeFavoriteBook);

export default router;