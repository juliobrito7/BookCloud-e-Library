import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            return res.status(401).json({ message: "No autorizado - No se proporcionó un token de acceso" });
        }
        
    try {
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        req.user = user;

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "No autorizado - El token de acceso ha expirado" });
    }
    throw error;
    }
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(401).json({ message: "No autorizado - Token de acceso inválido" });
    }
};


export const adminRoute = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ message: "Acceso denegado - Solo para administradores" });
    }
};