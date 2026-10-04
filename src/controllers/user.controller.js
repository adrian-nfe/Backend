import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Book from "../models/Book.js";
import User from '../models/User.js';
import deleteImage from '../utils/delete-image.js';

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            await deleteImage(req.file?.filename);

            return res.status(409).json({
                message: "El email ya está registrado",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "La imagen es obligatoria",
            });
        }

        if (!password || password.length < 6) {
            await deleteImage(req.file.filename);

            return res.status(400).json({
                message: "La contraseña debe tener al menos 6 caracteres",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user",
            image: {
                url: req.file.path,
                publicId: req.file.filename,
            },
            favoriteBooks: [],
        });

        const responseUser = user.toObject();
        delete responseUser.password;

        res.status(201).json(responseUser);
    } catch (error) {
        await deleteImage(req.file?.filename);

        res.status(500).json({
            message: "Error al crear el usuario",
            error: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                message: "Credenciales incorrectas",
            });
        }

        const passwordIsValid = await bcrypt.compare(password, user.password);

        if (!passwordIsValid) {
            return res.status(401).json({
                message: "Credenciales incorrectas",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h",
            }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al iniciar sesión",
        });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().populate("favoriteBooks");

        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener los usuarios",
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("favoriteBooks");

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener el usuario",
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const requestedUserId = req.params.id;
        const loggedUserId = req.user._id.toString();

        const isOwnAccount = requestedUserId === loggedUserId;
        const isAdministrator = req.user.role === "admin";

        if (!isOwnAccount && !isAdministrator) {
            await deleteImage(req.file?.filename);

            return res.status(403).json({
                message: "No puedes actualizar otra cuenta",
            });
        }

        const user = await User.findById(requestedUserId);

        if (!user) {
            await deleteImage(req.file?.filename);

            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        const update = { name, email };

        if (req.file) {
            update.image = {
                url: req.file.path,
                publicId: req.file.filename,
            };
        }

        const updatedUser = await User.findByIdAndUpdate(
            requestedUserId,
            update,
            { returnDocument: 'after', runValidators: true }
        );

        if (req.file) {
            await deleteImage(user.image?.publicId);
        }

        res.json(updatedUser);
    } catch (error) {
        await deleteImage(req.file?.filename);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "El email ya está registrado por otro usuario",
            });
        }
        
        res.status(500).json({
            message: "Error al actualizar el usuario",
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const requestedUserId = req.params.id;
        const loggedUserId = req.user._id.toString();

        const isOwnAccount = requestedUserId === loggedUserId;
        const isAdministrator = req.user.role === "admin";

        if (!isOwnAccount && !isAdministrator) {
            return res.status(403).json({
                message: "No puedes eliminar otra cuenta",
            });
        }

        const user = await User.findById(requestedUserId);

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        await deleteImage(user.image?.publicId);

        await User.findByIdAndDelete(requestedUserId);

        res.json({
            message: "Usuario e imagen eliminados correctamente",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar el usuario",
            error: error.message,
        });
    }
};

export const changeRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({
                message: "Rol no válido",
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { returnDocument: 'after', runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado",
            });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: "Error al cambiar el rol",
        });
    }
};

export const addFavoriteBook = async (req, res) => {
    try {
        const { bookId } = req.body;

        const bookExists = await Book.findById(bookId);

        if (!bookExists) {
            return res.status(404).json({
                message: "Libro no encontrado",
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $addToSet: {
                    favoriteBooks: bookId,
                },
            },
            {
                returnDocument: 'after',
            }
        ).populate("favoriteBooks");

        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: "Error al añadir el libro favorito",
        });
    }
};

export const removeFavoriteBook = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $pull: {
                    favoriteBooks: req.params.bookId,
                },
            },
            {
                returnDocument: 'after',
            }
        ).populate("favoriteBooks");

        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: "Error al eliminar el libro favorito",
        });
    }
};