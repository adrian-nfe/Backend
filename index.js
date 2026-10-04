import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

import userRoutes from './src/routes/user.routes.js';
import bookRoutes from './src/routes/book.routes.js';

import routeNotFound from './src/utils/route-not-found.js';
import errorHandler from './src/utils/error-handler.js';

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "API encendida",
    });
});

app.use("/users", userRoutes);
app.use("/books", bookRoutes);

app.use(routeNotFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB conectado");

        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error conectando con MongoDB:", error);
    });