import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        image: {
            url: {
                type: String,
                required: true,
            },
            publicId: {
                type: String,
                required: true,
            },
        },
        favoriteBooks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Book",
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", userSchema);