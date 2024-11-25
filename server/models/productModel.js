import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        min: 0,
        required: true
    },
    image:{
        type: String,
        required: [true,'Se requiere una imagen'],
    },
    category:{
        type: String,
        required: true
    },
    isFeatured:{
        type: Boolean,
        default: false
    },
    ISBN: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    numberPages: {
        type: Number,
        required: true
    },
    publicationDate: {
        type: String,
        required: true,
        match: /^\d{4}-\d{2}-\d{2}$/
    }
},
{ timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;