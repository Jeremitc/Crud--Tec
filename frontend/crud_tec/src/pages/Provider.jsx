import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Provider() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl px-6"
      >
        <h1 className="text-5xl font-extrabold mb-4">Providers</h1>
        <p className="text-lg text-gray-300 mb-8">
          Manage your providers (coming soon).
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