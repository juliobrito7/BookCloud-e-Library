import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
	{ href: "/Cómics y Mangas", name: "Cómics y Mangas", imageUrl: "/comics-mangas.jpg" },
	{ href: "/Deportes", name: "Deportes", imageUrl: "/deportes.jpg" },
	{ href: "/Ficción", name: "Ficción", imageUrl: "/ficcion.jpg" },
	{ href: "/Infantil y Juvenil", name: "Infantil y Juvenil", imageUrl: "/infantil-juvenil.jpg" },
	{ href: "/Estudios literarios y Biografías", name: "Estudios literarios y Biografías", imageUrl: "/estudios-literarios-biografias.jpg" },
	{ href: "/Salud y Desarrollo personal", name: "Salud y Desarrollo personal", imageUrl: "/salud-desarrollo-personal.jpg" },
	{ href: "/Tecnología", name: "Tecnología", imageUrl: "/tecnologia.jpg" },
];

const HomePage = () => {
    const { fetchFeaturedProducts, products, isLoading } = useProductStore();

	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);

    return (
        <div className='relative min-h-screen text-white overflow-hidden'>
            <div className='relative z-10 max-w-7x1 mx-auto px-4 sm:px-6 lg:px-8 py-16'>
                <h1 className='text-center text-5x1 sm:text-6x1 font-bold text-emerald-400 mb-4'>
                    Explora nuestras categorías
                </h1>
                <p className='text-center text-x1 text-gray-300 mb-12'>
                    ¡Descubre lo último y lo mejor en el mundo de los libros aquí en BookCloud!
                </p>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    { categories.map((category) => (
                        <CategoryItem category={ category } key={ category.name } />
                    ))}
                </div>

                {!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
            </div>
        </div>
    )
};

export default HomePage;