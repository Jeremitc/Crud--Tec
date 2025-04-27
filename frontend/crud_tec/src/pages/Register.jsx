import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/auth_context';
import { motion } from 'framer-motion';
import axios from 'axios';

const Register = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/api/auth/register', {
        nombre_usuario: nombreUsuario,
        correo,
        password,
      });

      if (response.data.ingresa) {
        login(response.data.usuario);
        navigate('/home');
      } else {
        throw new Error(response.data.error || 'Error al registrarse');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      const backendError = err.response?.data?.error || 'Error al registrarse';
      setError(backendError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-sm md:max-w-md"
      >
        <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
          Register
        </h2>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm text-center mb-6"
          >
            {error}
          </motion.p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="nombreUsuario"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              id="nombreUsuario"
              type="text"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition duration-300 text-gray-900 placeholder-gray-500"
              placeholder="Your username"
              disabled={isLoading}
            />
          </div>
          <div>
            <label
              htmlFor="correo"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              id="correo"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition duration-300 text-gray-900 placeholder-gray-500"
              placeholder="your@email.com"
              disabled={isLoading}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition duration-300 text-gray-900 placeholder-gray-500"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
          <motion.button
            whileHover={{ scale: isLoading ? 1 : 1.05 }}
            whileTap={{ scale: isLoading ? 1 : 0.95 }}
            type="submit"
            className={`w-full bg-gray-900 text-white py-3 rounded-xl font-semibold transition duration-300 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </motion.button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-8">
          Already have an account?{' '}
          <a href="/" className="text-gray-900 font-medium hover:underline">
            Sign in
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;