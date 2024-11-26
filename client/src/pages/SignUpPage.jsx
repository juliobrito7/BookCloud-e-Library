import { useState } from "react";
import { Link } from "react-router-dom";
import { UserPlus, Mail, Lock, User, ArrowRight, Loader } from 'lucide-react';
import { motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
    });

    const { signup, loading } = useUserStore();


    const validateInput = (field, value) => {
        let error = "";
    
        if (field === "name") {
            const nameRegex = /^[a-zA-ZÀ-ÿ]+( [a-zA-ZÀ-ÿ]+){0,2}$/;
            if (!nameRegex.test(value)) {
                error = "El nombre debe contener solo letras y un solo espacio.";
            }
        } else if (field === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                error = "El correo electrónico no tiene un formato válido.";
            }
        } else if (field === "password") {
            const passwordRegex = /^[a-zA-Z0-9]+$/;
            if (value.length < 6) {
                error = "La contraseña debe tener al menos 6 caracteres.";
            } else if (!passwordRegex.test(value)) {
                error = "La contraseña solo puede contener letras y números";
            }
        }
    
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: error,
        }));
    };
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        validateInput(id, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                confirmPassword: "Las contraseñas no coinciden.",
            }));
            return;
        }
    
        signup(formData);
    };

    return (
        <div className='flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
            <motion.div className='sm:mx-auto sm:w-full sm:max-w-md' initial={{ opacity: 0, y: -20}} animate={{ opacity: 1, y: 0}} transition={{ duration: 0.8 }}>
                <h2 className='mt-6 text-center text-3x1 font-extrabold text-emerald-400'>Crea Tu Cuenta</h2>
            </motion.div>

            <motion.div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md' initial={{ opacity: 0, y: 20}} animate={{ opacity: 1, y: 0}} transition={{ duration: 0.8, delay: 0.2}}>
                <div className='bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10'>
                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div>
                            <label htmlFor='name' className='block text-sm font-medium text-gray-300'>Nombre Completo</label>
                            <div className="mt-1 relative flex items-center">
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <User className='h-5 w-5 text-gray-400' aria-hidden='true' />
                                </div>
                                <input id='name' type='text' required value={formData.name} onChange={handleChange} className={`block w-full px-3 py-2 pl-10 bg-gray-700 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 sm:text-sm ${
                                        errors.name ? "border-red-500 focus:border-red-500" : "border-gray-600"
                                    }`}
                                    placeholder='Nombre Completo' />
                                    {errors.name && <p className="text-red-500 text-sm mt-1 absolute top-full">{errors.name}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor='email' className='block text-sm font-medium text-gray-300'>Correo Electrónico</label>
                            <div className="mt-1 relative flex items-center">
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Mail className='h-5 w-5 text-gray-400' aria-hidden='true' />
                                </div>
                                <input id='email' type='email' required value={formData.email} onChange={handleChange} className={`block w-full px-3 py-2 pl-10 bg-gray-700 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 sm:text-sm ${
                                        errors.email ? "border-red-500 focus:border-red-500" : "border-gray-600"
                                    }`}
                                    placeholder='correo@ejemplo.com' />
                                    {errors.email && <p className="text-red-500 text-sm mt-1 absolute top-full">{errors.email}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor='password' className='block text-sm font-medium text-gray-300'>Contraseña</label>
                            <div className="mt-1 relative flex items-center">
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
                                </div>
                                <input id='password' type='password' required value={formData.password} onChange={handleChange} className={`block w-full px-3 py-2 pl-10 bg-gray-700 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 sm:text-sm ${
                                        errors.password ? "border-red-500 focus:border-red-500" : "border-gray-600"
                                        }`}
                                        placeholder='••••••••' />
                                        {errors.password && <p className="text-red-500 text-sm mt-1 absolute top-full">{errors.password}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-300'>Confirmar Contraseña</label>
                            <div className="mt-1 relative flex items-center">
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Lock className='h-5 w-5 text-gray-400' aria-hidden='true' />
                                </div>
                                <input id='confirmPassword' type='password' required value={formData.confirmPassword} onChange={handleChange} className={`block w-full px-3 py-2 pl-10 bg-gray-700 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 sm:text-sm ${
                                        errors.confirmPassword ? "border-red-500 focus:border-red-500" : "border-gray-600"
                                        }`}
                                        placeholder='••••••••' />
                                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 absolute top-full">{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        <button type='submit' className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out disabled:opacity-50' disabled={loading}>
                            {loading ? (
                                <>
                                <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                                Cargando...
                                </>
                            ) : (
                                <>
                                <UserPlus className='mr-2 h-5 w-5' aria-hidden='true' />
                                Registrarse
                                </>
                            )}
                        </button>
                    </form>

                    <p className='mt-8 text-center text-sm text-gray-400'>
                        ¿Ya tienes una cuenta?{" "}
                        <Link to='/login' className='font-medium text-emerald-400 hover:text-emerald-300'>
                        Inicia sesión aquí <ArrowRight className='inline h-4 w-4' />
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default SignUpPage;