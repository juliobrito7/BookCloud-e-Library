import { create } from "zustand";
import axios from "../config/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
    cart: [],
    total: 0,
    subtotal: 0,

    clearCart: () => {
        const { cart } = get();
        if (cart.length === 0) {
            console.log("Cart is already cleared, skipping...");
            return;
        }
        set({ cart: [], total: 0, subtotal: 0 });
        console.log("Cart cleared after successful purchase");
        toast.success("El carrito se vació tras completar la compra con éxito");
        localStorage.removeItem("cart");
    },
    
    getCartItems: async () => {
    set({ loading: true });
    try {
        const res = await axios.get("/cart");
        set({ cart: res.data });
        get().calculateTotals();
    } catch (error) {
        set({ cart: [] });
        toast.error(error.response?.data?.message || "Ocurrió un error");
    } finally {
        set({ loading: false });
    }
},

    addToCart: async (product) => {
        const userRole = get().user?.role;
        if (userRole === "admin") {
            toast.error("Los administradores no pueden agregar productos al carrito");
            return;
        }
        try {
            await axios.post("/cart", { productId: product._id });
            toast.success("Producto agregado al carrito");

            set((prevState) => {
                const existingItem = prevState.cart.find((item) => item._id === product._id);
                const newCart = existingItem
                    ? prevState.cart.map((item) =>
                        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                    )
                    : [...prevState.cart, { ...product, quantity: 1 }];
                return { cart: newCart };
            });
            get().calculateTotals();
        } catch (error) {
            toast.error(error.response.data.message || "Ocurrió un error");
        }
    },
    removeFromCart: async (productId) => {
        await axios.delete(`/cart`, { data: { productId } });
        set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
        get().calculateTotals();
    },
    updateQuantity: async (productId, quantity) => {
        if (quantity === 0) {
            get().removeFromCart(productId);
            return;
        }

        await axios.put(`/cart/${productId}`, { quantity });
        set((prevState) => ({
            cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
        }));
        get().calculateTotals();
    },
    calculateTotals: () => {
        const { cart } = get();
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const total = subtotal;

        set({ subtotal, total });
    },
}));
