import { createPreference, preference, fetchPreference } from "../config/mercadoPago.js";
import Order from "../models/orderModel.js";
import User from "../models/userModel.js";

export const createCheckoutSession = async (req, res) => {
    try {
        const { products } = req.body;
        console.log("Products received in request:", products);
        if (!Array.isArray(products) || products.length === 0) {
            console.log("Invalid or empty products array");
            return res.status(400).json({ error: "Array de productos inválido o vacío" });
        }

        console.log("Received products:", products);

        let totalAmount = 0;

        const items = products.map(product => {
            if (typeof product.price !== 'number' || typeof product.quantity !== 'number' || !product.name) {
                console.log("Invalid product format:", product);
                throw new Error("Formato de producto inválido");
            }
            const amount = Math.round(product.price * 100);
            totalAmount += amount * product.quantity;

            return {
                id: product.id || product._id,
                title: product.name,
                quantity:  Number(product.quantity) || 1,
                currency_id: "ARS",
                unit_price: amount / 100,
                picture_url: product.image || null,
            };
        }).filter(item => item);

        console.log("Items prepared for MercadoPago:", items);
        console.log("Total amount calculated (before discount):", totalAmount);

        totalAmount = Math.max(totalAmount, 0);
        console.log("Total amount after processing:", totalAmount);

        const preferenceData = {
            items: items,
            back_urls: {
                success: `${process.env.CLIENT_URL}/purchase-success`,
                failure: `${process.env.CLIENT_URL}/purchase-cancel`,
                pending: `${process.env.CLIENT_URL}/purchase-pending`,
            },
            auto_return: "approved",
            metadata: {
                userId: req.user._id.toString(),
                products: products.map(p => ({
                    id: p._id,
                    name: p.name,
                    price: p.price,
                    quantity: p.quantity
                })),
                totalAmount: totalAmount / 100,
            },
        };

        console.log("Creating MercadoPago preference:", JSON.stringify(preferenceData, null, 2));

        const response = await createPreference(preferenceData);
        const preferenceId  = response.id;
        console.log("MercadoPago preference created. Preference ID:", preferenceId);

        res.status(200).json({ id: preferenceId, totalAmount: totalAmount / 100 });
    } catch (error) {
        console.log("Error processing checkout", error.message);
        res.status(500).json({ message: "Error al procesar el pago", error: error.message });
    }
};

export const getPreference = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Se requiere el ID de preferencia" });
        }

        // Verificar si ya existe una orden con este mercadoPagoPreferenceId
        const existingOrder = await Order.findOne({ mercadoPagoPreferenceId: id });
        if (existingOrder) {
            return res.status(200).json({
                message: "La orden ya existe",
                orderId: existingOrder._id,
            });
        }

        const preferenceData = await fetchPreference(id);

        if (!preferenceData) {
            return res.status(400).json({ message: "Error al recuperar los datos de la preferencia" });
        }

        const metadata = preferenceData.metadata;
        const { userId, products, totalAmount } = metadata;

        const order = new Order({
        user: userId,
        products: products.map(p => ({
            product: p.id,
            quantity: p.quantity,
            price: p.price,
        })),
        totalAmount: totalAmount,
        status: "approved",
        mercadoPagoPreferenceId: id,
    });

    await order.save();

        await User.findByIdAndUpdate(userId, { cartItems: [] });

        res.status(200).json({
        message: "Orden creada con éxito",
        orderId: order._id,
    });
}   catch (error) {
    console.error("Error fetching preference data:", error);
    res.status(500).json({ message: "Error al obtener los datos de la preferencia", error: error.message });
}
};