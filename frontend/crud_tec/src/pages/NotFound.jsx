import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-6xl font-extrabold mb-4">404</h1>
        <p className="text-xl text-gray-300 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/home')}
          className="px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-200 transition duration-300"
        >
          Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
}