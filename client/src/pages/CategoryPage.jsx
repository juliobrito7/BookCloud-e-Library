import { Search } from 'lucide-react';
import { useEffect, useState } from "react";
import { useProductStore } from "../stores/useProductStore";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
	const { fetchProductsByCategory, products } = useProductStore();

	const { category } = useParams();

	const [searchTerm, setSearchTerm] = useState('');
	const [sortOrder, setSortOrder] = useState('asc');

	useEffect(() => {
		fetchProductsByCategory(category);
	}, [fetchProductsByCategory, category]);

	const filteredProducts = products.filter((product) =>
		product.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const sortedProducts = filteredProducts.sort((a, b) => {
		if (sortOrder === 'asc') {
			return a.price - b.price;
		} else {
			return b.price - a.price;
		}
	});

	console.log("products:", products);
	return (
		<div className='min-h-screen'>
			<div className='relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<motion.h1 className='text-center text-4xl sm:text-5xl font-bold  text-emerald-400 mb-8' initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
					{category.charAt(0).toUpperCase() + category.slice(1)}
				</motion.h1>

				<div className="flex justify-between items-center mb-6">
				<div className="relative w-64">
					<input
						type="text"
						placeholder="Buscar por nombre..."
						className="px-4 py-2 rounded-md text-gray-700 w-full pr-10"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
							<Search size={20} />
						</span>
					</div>
					<select
						className="px-4 py-2 rounded-md text-gray-700"
						value={sortOrder}
						onChange={(e) => setSortOrder(e.target.value)}
					>
						<option value="asc">Ordenar por precio: Ascendente</option>
						<option value="desc">Ordenar por precio: Descendente</option>
					</select>
				</div>

				<motion.div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
					{sortedProducts?.length === 0 && (
						<h2 className='text-3xl font-semibold text-gray-300 text-center col-span-full'>
							No se encontraron productos
						</h2>
					)}

					{sortedProducts?.map((product) => (
						<ProductCard key={product._id} product={product} />
					))}
				</motion.div>
			</div>
		</div>
	);
};
export default CategoryPage;