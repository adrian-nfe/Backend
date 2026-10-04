import express from 'express';
import {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook,
} from '../controllers/book.controller.js';
import { auth } from '../middlewares/auth.middleware.js';
import { isAdmin } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", auth, isAdmin, createBook);
router.put("/:id", auth, isAdmin, updateBook);
router.delete("/:id", auth, isAdmin, deleteBook);

export default router;