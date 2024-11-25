import { motion } from "framer-motion";
import { Loader, PlusCircle, Upload } from "lucide-react";
import { useState } from "react";
import { useProductStore } from "../stores/useProductStore";

const categories = ["Cómics y Mangas", "Deportes", "Estudios literarios y Biografías", "Ficción", "Infantil y Juvenil", "Salud y Desarrollo personal", "Tecnología"];

const CreateProductForm = () => {
	const [newProduct, setNewProduct] = useState({
		name: "",
		author: "",
		description: "",
		price: "",
		category: "",
		image: "",
		ISBN: "",
		language: "",
		publisher: "",
		numberPages: "",
		publicationDate: "",
	});

	const { createProduct, loading } = useProductStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await createProduct(newProduct);
			setNewProduct({ name: "", author: "", description: "", price: "", category: "", image: "", ISBN: "", language: "", publisher: "", numberPages: "", publicationDate: "" });
		} catch {
			console.log("Error al crear un producto");
		}
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setNewProduct({ ...newProduct, image: reader.result });
			};

			reader.readAsDataURL(file);
		}
	};

	return (
		<motion.div
			className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h2 className='text-2xl font-semibold mb-6  text-emerald-300'>Crear nuevo producto</h2>

			<form onSubmit={handleSubmit} className='space-y-4'>
				<div>
					<label htmlFor='name' className='block text-sm font-medium  text-gray-300'>
						Nombre del producto
					</label>
					<input type='text' id='name' name='name' value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className='mt-1 block w-full  bg-gray-700 border  border-gray-600 rounded-md shadow-sm py-2 px-3  text-white focus:outline-none focus:ring-2 	focus:ring-emerald-500  focus:border-emerald-500' required/>
				</div>

				<div>
					<label htmlFor='author' className='block text-sm font-medium  text-gray-300'>
						Autor
					</label>
					<input type='text' id='author' name='author' value={newProduct.author} onChange={(e) => setNewProduct({ ...newProduct, author: e.target.value })} className='mt-1 block w-full  bg-gray-700 border  border-gray-600 rounded-md shadow-sm py-2 px-3  text-white focus:outline-none focus:ring-2 	focus:ring-emerald-500  focus:border-emerald-500' required/>
				</div>

				<div>
					<label htmlFor='ISBN' className='block text-sm font-medium text-gray-300'>
						ISBN
					</label>
					<input type='text' id='ISBN' name='ISBN' value={newProduct.ISBN} onChange={(e) => setNewProduct({ ...newProduct, ISBN: e.target.value })} className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500' required/>
				</div>

				<div>
					<label htmlFor='language' className='block text-sm font-medium text-gray-300'>
						Idioma
					</label>
					<input type='text' id='language' name='language' value={newProduct.language} onChange={(e) => setNewProduct({ ...newProduct, language: e.target.value })} className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500' required/>
				</div>

				<div>
					<label htmlFor='publisher' className='block text-sm font-medium text-gray-300'>
						Editorial
					</label>
					<input type='text' id='publisher' name='publisher' value={newProduct.publisher} onChange={(e) => setNewProduct({ ...newProduct, publisher: e.target.value })} className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500' required/>
				</div>

				<div>
					<label htmlFor='numberPages' className='block text-sm font-medium text-gray-300'>
						Número de páginas
					</label>
					<input type='number' id='numberPages' name='numberPages' value={newProduct.numberPages} onChange={(e) => setNewProduct({ ...newProduct, numberPages: e.target.value })} className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500' required/>
				</div>

				<div>
					<label htmlFor='publicationDate' className='block text-sm font-medium text-gray-300'>
						Fecha de publicación
					</label>
					<input type='date' id='publicationDate' name='publicationDate' value={newProduct.publicationDate} onChange={(e) => setNewProduct({ ...newProduct, publicationDate: e.target.value })} className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500' required/>
				</div>

				<div>
					<label htmlFor='description' className='block text-sm font-medium  text-gray-300'>
						Descripción
					</label>
					<textarea id='description' name='description' value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} rows='3' className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3  text-white focus:outline-none focus:ring-2  focus:ring-emerald-500  focus:border-emerald-500' required/>
				</div>

				<div>
					<label htmlFor='price' className='block text-sm font-medium  text-gray-300'>
						Precio
					</label>
					<input type='number' id='price' name='price' value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} step='0.01' className='mt-1 block w-full  bg-gray-700 border  border-gray-600 rounded-md shadow-sm py-2 px-3  text-white focus:outline-none focus:ring-2  focus:ring-emerald-500  focus:border-emerald-500' required/>
				</div>

				<div>
					<label htmlFor='category' className='block text-sm font-medium text-gray-300'>
						Categoría
					</label>
					<select id='category' name='category' value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500' required>
						<option value=''>Selecciona una categoría</option>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>
				</div>

				<div className='mt-1 flex items-center'>
					<input type='file' id='image' className='sr-only' accept='image/*' onChange={handleImageChange} />
					<label htmlFor='image' className='cursor-pointer  bg-gray-700 py-2 px-3 border  border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium  text-gray-300  hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-emerald-500'>
                        <Upload className='h-5 w-5 inline-block mr-2' />
						Subir imagen
					</label>
					{newProduct.image && <span className='ml-3 text-sm  text-gray-400'>Imagen subida </span>}
				</div>

				{newProduct.image && (
                    <div className='mt-4'>
                        <h3 className='text-sm font-medium text-gray-300 mb-2'>Vista previa de la imagen</h3>
                        <img src={newProduct.image} alt='Preview' className='w-full h-auto max-h-64 object-contain rounded-md border border-gray-600' />
                    </div>
                )}

				<button type='submit' className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium  text-white  bg-emerald-600  hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-emerald-500 disabled:opacity-50' disabled={loading}>
					{loading ? (
						<>
							<Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
							Cargando...
						</>
					) : (
						<>
							<PlusCircle className='mr-2 h-5 w-5' />
							Crear producto
						</>
					)}
				</button>
			</form>
		</motion.div>
	);
};
export default CreateProductForm;