import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../config/axios";

export const useProductStore = create((set) => ({
	products: [],
	loading: false,

	setProducts: (products) => set({ products }),
	createProduct: async (productData) => {
		set({ loading: true });
		try {
			const res = await axios.post("/products", productData);
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
		} catch (error) {
			toast.error(error.response.data.error);
			set({ loading: false });
		}
	},
	fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products");
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Error al obtener los productos", loading: false });
			toast.error(error.response.data.error || "Error al obtener los productos");
		}
	},
	fetchProductsByCategory: async (category) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/category/${category}`);
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Error al obtener los productos", loading: false });
			toast.error(error.response.data.error || "Error al obtener los productos");
		}
	},
	getProductById: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.get(`/products/${productId}`);
			set({ loading: false });
			return response.data;
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Error al obtener los productos");
		}
	},
	
	updateProduct: async (productId, updatedData) => {
		set({ loading: true });
		try {
			console.log("Updated Data:", updatedData);
			const response = await axios.put(`/products/${productId}`, updatedData);
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? response.data : product
				),
				loading: false,
			}));
		} catch (error) {
			console.error("Error al actualizar el producto:", error);
			set({ loading: false });
			toast.error(error.response.data.error || "No se pudo actualizar el producto");
		}
	},
	
	deleteProduct: async (productId) => {
		set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "No se pudo eliminar el producto");
		}
	},
	toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
            
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
				),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "No se pudo actualizar el producto");
		}
	},
	fetchFeaturedProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products/featured");
			set({ products: response.data, loading: false });
		} catch (error) {
			set({ error: "No se pudieron obtener los productos", loading: false });
			console.log("Error al obtener los productos destacados:", error);
		}
	},
}));