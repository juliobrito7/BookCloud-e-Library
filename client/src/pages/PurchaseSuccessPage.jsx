import { ArrowRight, CheckCircle, HandHeart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCartStore } from "../stores/useCartStore";
import axios from "../config/axios";
import Confetti from "react-confetti";

const PurchaseSuccessPage = () => {
    const [purchaseData, setPurchaseData] = useState(null);
    const [error, setError] = useState(null);
    const [cartUpdated, setCartUpdated] = useState(false);
    const { clearCart, cart } = useCartStore();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("preference_id");

    useEffect(() => {
        let didCancel = false;
        const fetchPurchaseData = async () => {
            try {
                console.log("Recuperando datos de la compra con el ID:", id);
                const response = await axios.get(`/payments/checkout/preferences/${id}`);
                if (!didCancel) {
                console.log("Respuesta de la compra:", response.data);
                const data = response.data;
                setPurchaseData(data);

                if (data && (data.message === "Orden creada con éxito" || data.message === "La orden ya existe")) {
                    if (!cartUpdated) {
                        clearCart();
                        setCartUpdated(true);
                    }
                }
                }
            } catch (error) {
                if (!didCancel) {
                setError(error.response?.data?.message || "Error al obtener los datos de la compra");
            }
            }
        };

        if (id) {
            fetchPurchaseData();
        }
        return () => {
            didCancel = true;
        };
    }, [id, clearCart, cart]);

    if (error) {
        return (
            <div className='h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <h2 className='text-red-500 font-bold text-xl mb-4'>Error</h2>
                    <p className='text-gray-300'>{error}</p>
                    <Link to="/" className='text-emerald-400 hover:text-emerald-600'>
                        Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }

    if (!purchaseData) {
        return (
            <div className='h-screen flex items-center justify-center'>
                <p className='text-gray-300'>Cargando...</p>
            </div>
        );
    }

    return (
        <div className='h-screen flex items-center justify-center px-4'>
            <Confetti width={window.innerWidth} height={window.innerHeight} gravity={0.1} style={{ zIndex: 99 }} numberOfPieces={700} recycle={false} />

            <div className='max-w-md w-full bg-gray-800 rounded-lg shadow-xl overflow-hidden relative z-10'>
                <div className='p-6 sm:p-8'>
                    <div className='flex justify-center'>
                        <CheckCircle className='text-emerald-400 w-16 h-16 mb-4' />
                    </div>
                    <h1 className='text-2xl sm:text-3xl font-bold text-center text-emerald-400 mb-2'>
                        ¡Compra Exitosa!
                    </h1>
                    <p className='text-gray-300 text-center mb-2'>
                        Gracias por tu compra. Estamos procesando tu pedido ahora.
                    </p>
                    <p className='text-emerald-400 text-center text-sm mb-6'>
                        Revisa tu correo para los detalles de tu pedido y actualizaciones.
                    </p>
                    <div className='bg-gray-700 rounded-lg p-4 mb-6'>
                        <div className='flex items-center justify-between mb-2'>
                            <span className='text-sm text-gray-400'>Número de pedido</span>
                            <span className='text-sm font-semibold text-emerald-400'>
                                #{purchaseData.orderId}
                            </span>
                        </div>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-400'>Entrega estimada</span>
                            <span className='text-sm font-semibold text-emerald-400'>3-5 días hábiles</span>
                        </div>
                    </div>
                    <div className='space-y-4'>
                        <button className='w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center'>
                            <HandHeart className='mr-2' size={18} />
                            ¡Gracias por confiar en nosotros!
                        </button>
                        <Link to="/" className='w-full bg-gray-700 hover:bg-gray-600 text-emerald-400 font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center'>
                            Continuar comprando
                            <ArrowRight className='ml-2' size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseSuccessPage;