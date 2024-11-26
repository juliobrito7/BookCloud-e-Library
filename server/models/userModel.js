import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre es requerido"],
        trim: true,
        validate: {
            validator: function (value) {
                const nameRegex = /^[a-zA-ZÀ-ÿ]+( [a-zA-ZÀ-ÿ]+){0,2}$/;
                return nameRegex.test(value);
            },
            message: "El nombre debe contener solo letras y un solo espacio.",
        },
    },
    email: {
        type: String,
        required: [true, "El correo electrónico es requerido"],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message: "El correo electrónico no es válido.",
        },
    },
    password: {
        type: String,
        required: [true, "La contraseña es requerida"],
        minLength: [6, "La contraseña debe tener al menos 6 caracteres"],
        validate: {
            validator: function (value) {
                const passwordRegex = /^[a-zA-Z0-9]+$/;
                return passwordRegex.test(value);
            },
            message: "La contraseña solo puede contener letras y números.",
        },
    },
    cartItems:[
        {
            quantity:{
                type: Number,
                default: 1,
            },
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"Product",
            },
        },
    ],
    role:{
        type: String,
        enum: ["customer","admin"],
        default: "customer",
    },
},
{ timestamps: true }
);

// Pre save hook to hash password before saving to database
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User",userSchema);

export default User;