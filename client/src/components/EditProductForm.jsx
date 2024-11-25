import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { Loader, Upload } from "lucide-react";

const categories = [
    "Cómics y Mangas", "Deportes", "Estudios literarios y Biografías",
    "Ficción", "Infantil y Juvenil", "Salud y Desarrollo personal", "Tecnología"
];

const EditProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getProductById, updateProduct, loading } = useProductStore();
    const [productData, setProductData] = useState({
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
	const [isImageUploaded, setIsImageUploaded] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const product = await getProductById(id);
                if (product) {
                    setProductData(product);
                } else {
                    navigate("/secret-dashboard");
                }
            } catch (error) {
                console.error("Error al recuperar el producto:", error);
            }
        };
        fetchProduct();
    }, [id, getProductById, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProductData((prevData) => ({ ...prevData, image: reader.result }));
				setIsImageUploaded(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProduct(id, productData);
            navigate("/secret-dashboard");
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    };

    return (
        <motion.div
            className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h2 className='text-2xl font-semibold mb-6 text-emerald-300'>Editar producto</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
                {/* Product Name */}
                <div>
                    <label htmlFor='name' className='block text-sm font-medium text-gray-300'>
                        Nombre del producto
                    </label>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        value={productData.name}
                        onChange={handleChange}
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        required
                    />
                </div>

                {/* Author */}
                <div>
                    <label htmlFor='name' className='block text-sm font-medium text-gray-300'>
                        Autor
                    </label>
                    <input
                        type='text'
                        id='author'
                        name='author'
                        value={productData.author}
                        onChange={handleChange}
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor='description' className='block text-sm font-medium text-gray-300'>
                        Descripción
                    </label>
                    <textarea
                        id='description'
                        name='description'
                        value={productData.description}
                        onChange={handleChange}
                        rows='3'
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        required
                    />
                </div>

                {/* Price */}
                <div>
                    <label htmlFor='price' className='block text-sm font-medium text-gray-300'>
                        Precio
                    </label>
                    <input
                        type='number'
                        id='price'
                        name='price'
                        value={productData.price}
                        onChange={handleChange}
                        step='0.01'
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        required
                    />
                </div>

                {/* Category */}
                <div>
                    <label htmlFor='category' className='block text-sm font-medium text-gray-300'>
                        Categoría
                    </label>
                    <select
                        id='category'
                        name='category'
                        value={productData.category}
                        onChange={handleChange}
                        className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                        required
                    >
                        <option value=''>Selecciona una categoría</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                 {/* ISBN */}
                <div>
                    <label htmlFor="ISBN" className="block text-sm font-medium text-gray-300">
                        ISBN
                    </label>
                    <input
                        type="text"
                        id="ISBN"
                        name="ISBN"
                        value={productData.ISBN}
                        onChange={handleChange}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                    />
                </div>

                {/* Language */}
                <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-300">
                        Idioma
                    </label>
                    <input
                        type="text"
                        id="language"
                        name="language"
                        value={productData.language}
                        onChange={handleChange}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                    />
                </div>

                {/* Publisher */}
                <div>
                    <label htmlFor="publisher" className="block text-sm font-medium text-gray-300">
                        Editorial
                    </label>
                    <input
                        type="text"
                        id="publisher"
                        name="publisher"
                        value={productData.publisher}
                        onChange={handleChange}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                    />
                </div>

                {/* Number Pages */}
                <div>
                    <label htmlFor="numberPages" className="block text-sm font-medium text-gray-300">
                        Número de páginas
                    </label>
                    <input
                        type="number"
                        id="numberPages"
                        name="numberPages"
                        value={productData.numberPages}
                        onChange={handleChange}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                    />
                </div>

                {/* Publication Date */}
                <div>
                    <label htmlFor="publicationDate" className="block text-sm font-medium text-gray-300">
                        Fecha de publicación
                    </label>
                    <input
                        type="date"
                        id="publicationDate"
                        name="publicationDate"
                        value={productData.publicationDate}
                        onChange={handleChange}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        required
                    />
                </div>

                {/* Image Upload */}
                <div className='mt-1 flex items-center'>
                    <input
                        type='file'
                        id='image'
                        className='sr-only'
                        accept='image/*'
                        onChange={handleImageChange}
                    />
                    <label htmlFor='image' className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'>
                        <Upload className='h-5 w-5 inline-block mr-2' />
                        Subir imagen
                    </label>
					{isImageUploaded && <span className='ml-3 text-sm text-gray-400'>Imagen subida</span>}
                </div>

                {/* Current Image Preview */}
                {productData.image && (
                    <div className='mt-4'>
                        <h3 className='text-sm font-medium text-gray-300'>Imagen actual:</h3>
                        <img src={productData.image} alt='Current Product' className='mt-2 w-40 h-auto max-h-40 border rounded-md' />
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type='submit'
                    className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
                    disabled={loading}
                >
                    {loading ? (
                        <Loader className='mr-2 h-5 w-5 animate-spin' />
                    ) : (
                        "Actualizar producto"
                    )}
                </button>
            </form>
        </motion.div>
    );
};

export default EditProductForm;
