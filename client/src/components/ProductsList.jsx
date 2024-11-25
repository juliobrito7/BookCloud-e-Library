import { Search } from 'lucide-react';
import { motion } from "framer-motion";
import { Trash, Star, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom"
import { useProductStore } from "../stores/useProductStore";
import { useState } from "react";

const ProductsList = () => {
	const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();
	const navigate = useNavigate();

	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [sortOrder, setSortOrder] = useState('asc');

	const filteredProducts = products.filter((product) => {

		const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());


		const categoryMatch = selectedCategory ? product.category === selectedCategory : true;


		return nameMatch && categoryMatch;
	});


	const sortedProducts = filteredProducts.sort((a, b) => {
		if (sortOrder === 'asc') {
			return a.price - b.price;
		} else {
			return b.price - a.price;
		}
	});

    const handleEditProduct = (productId) => {
        navigate(`/edit-product/${productId}`);
    };
	console.log("products", products);

	return (
		<motion.div className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto' initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
			<div className="p-4 flex items-center justify-between">
			<div className="relative w-64">
				<input
					type="text"
					placeholder="Buscar por nombre..."
					className="px-4 py-2 rounded-md text-gray-900 w-full pr-10"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
							<Search size={20} />
						</span>
				</div>
				<select
					className="px-4 py-2 rounded-md text-gray-700"
					value={selectedCategory}
					onChange={(e) => setSelectedCategory(e.target.value)}
				>
					<option value="">Todas las categorías</option>
					<option value="Cómics y Mangas">Cómics y Mangas</option>
					<option value="Deportes">Deportes</option>
					<option value="Estudios literarios y Biografías">Estudios literarios y Biografías</option>
					<option value="Ficción">Ficción</option>
					<option value="Infantil y Juvenil">Infantil y Juvenil</option>
					<option value="Salud y Desarrollo personal">Salud y Desarrollo personal</option>
					<option value="Tecnología">Tecnología</option>
				</select>

				<select
					className="px-4 py-2 rounded-md text-gray-700"
					value={sortOrder}
					onChange={(e) => setSortOrder(e.target.value)}
				>
					<option value="asc">Ordenar por precio: Ascendente</option>
					<option value="desc">Ordenar por precio: Descendente</option>
				</select>
			</div>

			<div className="overflow-x-auto">
			<table className=' min-w-full divide-y  divide-gray-700'>
				<thead className='bg-gray-700'>
					<tr>
						<th scope='col' className='px-6 py-3 text-left text-xs font-medium  text-gray-300 uppercase tracking-wider'>
							Producto
						</th>
						<th scope='col' className='px-6 py-3 text-left text-xs font-medium  text-gray-300 uppercase tracking-wider'>
							Precio
						</th>
						<th scope='col' className='px-6 py-3 text-left text-xs font-medium  text-gray-300 uppercase tracking-wider'>
							Categoría
						</th>

						<th scope='col' className='px-6 py-3 text-left text-xs font-medium  text-gray-300 uppercase tracking-wider'>
							Destacado
						</th>
						<th scope='col' className='px-6 py-3 text-left text-xs font-medium  text-gray-300 uppercase tracking-wider'>
							Acciones
						</th>
					</tr>
				</thead>

				<tbody className='bg-gray-800 divide-y divide-gray-700'>
						{sortedProducts?.map((product) => (
							<tr key={product._id} className='hover:bg-gray-700'>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center'>
										<div className='flex-shrink-0 h-10 w-10'>
											<img className='h-10 w-10 rounded-full object-cover' src={product.image} alt={product.name}/>
										</div>
										<div className='ml-4'>
											<div className='text-sm font-medium text-white'>{product.name}</div>
										</div>
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-300'>${product.price.toFixed(2)}</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='text-sm text-gray-300'>{product.category}</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<button onClick={() => toggleFeaturedProduct(product._id)} className={`p-1 rounded-full ${ product.isFeatured ? "bg-yellow-400  text-gray-900" : "bg-gray-600  text-gray-300"} hover:bg-yellow-500 transition-colors duration-200`}>
										<Star className='h-5 w-5' />
									</button>
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
									<button onClick={() => handleEditProduct(product._id)} className='text-blue-400 hover:text-blue-300'>
										<Edit className='h-5 w-5' />
									</button>
									<button onClick={() => deleteProduct(product._id)} className='text-red-400 hover:text-red-300'>
										<Trash className='h-5 w-5' />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>
	);
};

export default ProductsList;