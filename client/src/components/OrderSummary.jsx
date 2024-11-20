import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import axios from "../config/axios";

const OrderSummary = () => {
	const { total, subtotal, cart } = useCartStore();
	const [mpInstance, setMpInstance] = useState(null);
	const [isMpReady, setIsMpReady] = useState(false);

	const savings = subtotal - total;
	const formattedSubtotal = subtotal.toFixed(2);
	const formattedTotal = total.toFixed(2);
	const formattedSavings = savings.toFixed(2);

	useEffect(() => {
		const mercadoPagoPublicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;

		if (!mercadoPagoPublicKey) {
			console.error("La clave pública de MercadoPago no está definida");
			return;
		}

		const script = document.createElement("script");
		script.src = "https://sdk.mercadopago.com/js/v2";
		script.onload = () => {
			const mp = new window.MercadoPago(mercadoPagoPublicKey, {
				locale: "es-AR",
			});
			setMpInstance(mp);
			setIsMpReady(true);
		};
		script.onerror = () => {
			console.error("No se pudo cargar el script de MercadoPago");
			setIsMpReady(false);
		};
		document.body.appendChild(script);

		return () => {
			document.body.removeChild(script);
		};
	}, []);

	const handlePayment = async () => {
		console.log("Cart contents:", cart);
		if (!mpInstance) {
			console.error("La instancia de MercadoPago no está disponible");
			return;
		}
	
		const walletContainer = document.getElementById("wallet_container");
		if (!walletContainer) {
			console.error("Contenedor 'wallet_container' no encontrado");
			return;
		}
	
		try {
			const res = await axios.post("/payments/create-checkout-session", {
				products: cart,
			});
	
			const { id: preferenceId } = res.data;
			if (!preferenceId) {
				throw new Error("Error al crear la preferencia de pago");
			}
	
			mpInstance.bricks().create("wallet", "wallet_container", {
				initialization: {
					preferenceId: preferenceId,
				},
			});
		} catch (error) {
			console.error("Error:", error);
		}
	};
	

	return (
		<motion.div className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <p className="text-xl font-semibold text-emerald-400">Resumen de pedido</p>

    <div className="space-y-4">
        <div className="space-y-2">
            <dl className="flex items-center justify-between gap-4">
                <dt className="text-base font-normal text-gray-300">Precio original</dt>
                <dd className="text-base font-medium text-white">${formattedSubtotal}</dd>
            </dl>

            {savings > 0 && (
                <dl className="flex items-center justify-between gap-4">
                    <dt className="text-base font-normal text-gray-300">Ahorros</dt>
                    <dd className="text-base font-medium text-emerald-400">-${formattedSavings}</dd>
                </dl>
            )}

            <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
                <dt className="text-base font-bold text-white">Total</dt>
                <dd className="text-base font-bold text-emerald-400">${formattedTotal}</dd>
            </dl>
        </div>

        <motion.button className="flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handlePayment} disabled={!isMpReady}>
            Proceder al pago
        </motion.button>

        {/* Contenedor para el widget de pago de MercadoPago */}
        <div id="wallet_container"></div>

        <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-normal text-gray-400">o</span>
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline">
                Continuar comprando
                <MoveRight size={16} />
            </Link>
        </div>
    </div>
</motion.div>

	);
};

export default OrderSummary;
