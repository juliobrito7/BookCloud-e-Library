import express from "express";
import { createCheckoutSession, getPreference } from "../controllers/paymentController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.get("/checkout/preferences/:id", protectRoute, getPreference);

export default router;