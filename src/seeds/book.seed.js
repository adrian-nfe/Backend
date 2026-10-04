import 'dotenv/config';
import mongoose from 'mongoose';
import Book from '../models/Book.js';

const books = [
    {
        title: "El nombre del viento",
        author: "Patrick Rothfuss",
        genre: "Fantasía",
    },
    {
        title: "1984",
        author: "George Orwell",
        genre: "Ciencia ficción",
    },
    {
        title: "Cien años de soledad",
        author: "Gabriel García Márquez",
        genre: "Realismo mágico",
    },
    {
        title: "El señor de los anillos",
        author: "J. R. R. Tolkien",
        genre: "Fantasía",
    },
    {
        title: "Harry Potter y la piedra filosofal",
        author: "J. K. Rowling",
        genre: "Fantasía",
    },
    {
        title: "Dune",
        author: "Frank Herbert",
        genre: "Ciencia ficción",
    },
    {
        title: "Fahrenheit 451",
        author: "Ray Bradbury",
        genre: "Ciencia ficción",
    },
    {
        title: "Orgullo y prejuicio",
        author: "Jane Austen",
        genre: "Romance",
    },
    {
        title: "Crimen y castigo",
        author: "Fiódor Dostoyevski",
        genre: "Novela",
    },
    {
        title: "Don Quijote de la Mancha",
        author: "Miguel de Cervantes",
        genre: "Novela",
    },
    {
        title: "La sombra del viento",
        author: "Carlos Ruiz Zafón",
        genre: "Misterio",
    },
    {
        title: "Los juegos del hambre",
        author: "Suzanne Collins",
        genre: "Distopía",
    },
    {
        title: "El principito",
        author: "Antoine de Saint-Exupéry",
        genre: "Fábula",
    },
    {
        title: "Drácula",
        author: "Bram Stoker",
        genre: "Terror",
    },
    {
        title: "Frankenstein",
        author: "Mary Shelley",
        genre: "Terror",
    },
    {
        title: "La metamorfosis",
        author: "Franz Kafka",
        genre: "Novela",
    },
    {
        title: "El retrato de Dorian Gray",
        author: "Oscar Wilde",
        genre: "Novela",
    },
    {
        title: "El Hobbit",
        author: "J. R. R. Tolkien",
        genre: "Fantasía",
    },
    {
        title: "Neuromante",
        author: "William Gibson",
        genre: "Ciencia ficción",
    },
    {
        title: "El perfume",
        author: "Patrick Süskind",
        genre: "Misterio",
    },
];

const runSeed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Book.deleteMany({});
        await Book.insertMany(books);

        console.log("Seed ejecutado correctamente");
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
    }
};

runSeed();