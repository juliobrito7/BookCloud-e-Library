import mongoose from 'mongoose';
import cloudinary from "../config/cloudinary.js";
import { redis } from "../config/redis.js";
import Product from "../models/productModel.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ products });
    } catch (error) {
        console.log("Error in getAllProducts controller", error.message);
        res.status(500).json({ message: "Error del servidor", error: error.message });
    }
};


export const getFeaturedProducts = async (req, res) => {
    try {
        let featuredProducts = await redis.get("featured_products");
        if (featuredProducts) {
            return res.json(JSON.parse(featuredProducts));
        }


        featuredProducts = await Product.find({ isFeatured: true }).lean();

        if (!featuredProducts) {
            return res.status(404).json({ message: "No se encontraron productos destacados" });
        }

        await redis.set("featured_products", JSON.stringify(featuredProducts));

        res.json(featuredProducts);
    } catch (error) {
        console.log("Error in getFeaturedProducts controller", error.message);
        res.status(500).json({ message: "Error del servidor", error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const {name, author, description, price, image, category, ISBN, language, publisher, numberPages, publicationDate} = req.body;

        let cloudinaryResponse = null;

        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, {folder:"products"});
        }

            const product = await Product.create({
                name,
                author,
                description,
                price,
                image: cloudinaryResponse.secure_url ? cloudinaryResponse.secure_url : "",
                category,
                ISBN,
                language,
                publisher,
                numberPages,
                publicationDate
            });

            res.status(201).json(product);
    } catch (error) {
        console.log("Error in createProduct controller", error.message);
        res.status(500).json({ message: "Error del servidor", error: error.message });
    }
};


export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        if (product.image) {
            const publicId = product.image.split("/").pop().split(".")[0];
            try {
                await cloudinary.uploader.destroy(`products/${publicId}`);
                console.log("Image deleted from Cloudinary");
            } catch (error) {
                console.log("Error deleting image from Cloudinary", error.message);
            }
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({ message: "Producto eliminado con éxito" });
    } catch (error) {
        console.log("Error in deleteProduct controller", error.message);
        res.status(500).json({ message: "Error del servidor", error: error.message });
    }
};


export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([
            {
                $sample: {size: 4}
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    author: 1,
                    description: 1,
                    image: 1,
                    price: 1,
                    category: 1,
                    ISBN: 1,
                    language: 1
                }
            }
        ]);

        res.json(products);
    } catch (error) {
        console.log("Error in getRecommendedProducts controller", error.message);
        res.status(500).json({ message: "Error del servidor", error: error.message });
    }
};


export const getProductsByCategory = async (req, res) => {
    const {category} = req.params;
    try {
        const products = await Product.find({category});
        res.json({products});
    } catch (error) {
        console.log("Error in getProductsByCategory controller", error.message);
        res.status(500).json({ message: "Error del servidor", error: error.message });
    }
};


export const toggleFeaturedProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.isFeatured = !product.isFeatured;
            const updatedProduct = await product.save();
            await updateFeaturedProductsCache();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: "Producto no encontrado" });
        }
    } catch (error) {
        console.log("Error in toggleFeaturedProduct controller", error.message);
        res.status(500).json({ message: "Error del servidor", error: error.message });
    }
};

async function updateFeaturedProductsCache() {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).lean();
        await redis.set("featured_products", JSON.stringify(featuredProducts));
    } catch (error) {
        console.log("Error in update cache function");
    }
};

export const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        console.log("Product ID:", productId);
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

export const updateProduct = async (req, res) => {
    try {
    const productId = req.params.id;
    const updatedData = req.body;

    console.log("Product ID:", productId);
    console.log("Updated Data:", updatedData);
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ error: 'ID de producto inválido' });
    }

    const product = await Product.findByIdAndUpdate(productId, updatedData, {
        new: true,
        runValidators: true,
    });

    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json(product);
    } catch (error) {
    console.error("Error al actualizar el producto:", error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
    }
};