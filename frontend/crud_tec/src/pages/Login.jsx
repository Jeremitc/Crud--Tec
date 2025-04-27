import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/auth_context';
import { motion } from 'framer-motion';
import axios from 'axios';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('Submitting:', { usuario: identifier, password });

    try {
      const response = await axios.post('http://localhost:3001/api/auth', {
        usuario: identifier, // Match backend field name
        password,
      });

      console.log('API Response:', response.data);

      if (response.data.ingresa) {
        console.log('Login successful, calling auth context login...');
        login(response.data.usuario); // Pass user object directly
        navigate('/home');
      } else {
        throw new Error(response.data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('Login failed:', err);
      const backendError = err.response?.data?.error || 'Usuario, correo o contraseña incorrectos';
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
          Login
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
              htmlFor="identifier"
              className="block text-sm font-medium text-gray-700"
            >
              Username or Email
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="mt-2 w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition duration-300 text-gray-900 placeholder-gray-500"
              placeholder="your_username or your@email.com"
              disabled={isLoading}
            />
            <style jsx>{`
              input:-webkit-autofill,
              input:-webkit-autofill:hover,
              input:-webkit-autofill:focus,
              input:-webkit-autofill:active {
                -webkit-text-fill-color: #111827 !important;
                transition: background-color 5000s ease-in-out 0s;
              }
            `}</style>
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
            {isLoading ? 'Signing In...' : 'Sign In'}
          </motion.button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-8">
          Don't have an account?{' '}
          <a
            href="/register"
            className="text-gray-900 font-medium hover:underline"
          >
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;