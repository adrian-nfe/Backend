import Book from '../models/Book.js';

export const createBook = async (req, res) => {
    try {
        const { title, author, genre } = req.body;

        const book = await Book.create({
            title,
            author,
            genre,
        });

        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({
            message: "Error al crear el libro",
            error: error.message,
        });
    }
};

export const getBooks = async (req, res) => {
    try {
        const books = await Book.find();

        res.json(books);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener los libros",
        });
    }
};

export const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Libro no encontrado",
            });
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener el libro",
        });
    }
};

export const updateBook = async (req, res) => {
    try {
        const { title, author, genre } = req.body;

        const book = await Book.findByIdAndUpdate(
            req.params.id,
            { title, author, genre },
            { returnDocument: 'after', runValidators: true }
        );

        if (!book) {
            return res.status(404).json({
                message: "Libro no encontrado",
            });
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({
            message: "Error al actualizar el libro",
        });
    }
};

export const deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({
                message: "Libro no encontrado",
            });
        }

        res.json({
            message: "Libro eliminado correctamente",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar el libro",
        });
    }
};