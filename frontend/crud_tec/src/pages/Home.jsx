import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/auth_context';
import { motion } from 'framer-motion';

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl px-6"
      >
        <h1 className="text-5xl font-extrabold mb-4">
          Welcome, {user?.email || 'User'}!
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Explore our platform with seamless navigation and intuitive design.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition duration-300"
          >
            View Products
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/provider')}
            className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition duration-300"
          >
            Providers
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/seller')}
            className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition duration-300"
          >
            Seller Dashboard
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="px-6 py-3 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-700 transition duration-300"
          >
            Sign Out
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}