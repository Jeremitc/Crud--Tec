import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/auth_context';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaEdit, FaTrash, FaTimes, FaPlus, FaUser } from 'react-icons/fa';

export default function Seller() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // State for sellers list
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for add seller form
  const [showAddForm, setShowAddForm] = useState(location.hash === '#add');
  const [newSeller, setNewSeller] = useState({ nombre_vendedor: '', dni: '', celular: '', direccion: '' });
  const [addError, setAddError] = useState('');

  // State for edit seller modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSeller, setEditSeller] = useState(null);
  const [editError, setEditError] = useState('');

  // Fetch sellers on mount
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/vendedores');
        setSellers(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching sellers:', err);
        setError('Error al obtener los vendedores');
        setLoading(false);
      }
    };
    fetchSellers();
  }, []);

  // Handle showing the add form based on URL hash
  useEffect(() => {
    setShowAddForm(location.hash === '#add');
  }, [location.hash]);

  // Handle add seller form submission
  const handleAddSeller = async (e) => {
    e.preventDefault();
    setAddError('');

    try {
      const response = await axios.post('http://localhost:3001/api/vendedores', newSeller);
      setSellers([...sellers, response.data]);
      setNewSeller({ nombre_vendedor: '', dni: '', celular: '', direccion: '' });
      setShowAddForm(false);
      navigate('/seller');
    } catch (err) {
      console.error('Error adding seller:', err);
      const backendError = err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Error al crear el vendedor';
      setAddError(backendError);
    }
  };

  // Handle edit seller
  const handleEditSeller = (seller) => {
    setEditSeller({ ...seller });
    setShowEditModal(true);
  };

  const handleUpdateSeller = async (e) => {
    e.preventDefault();
    setEditError('');

    const updates = {};
    const originalSeller = sellers.find(s => s.id_vendedor === editSeller.id_vendedor);
    if (editSeller.nombre_vendedor !== originalSeller.nombre_vendedor) {
      updates.nombre_vendedor = editSeller.nombre_vendedor;
    }
    if (editSeller.dni !== originalSeller.dni) {
      updates.dni = editSeller.dni;
    }
    if (editSeller.celular !== originalSeller.celular) {
      updates.celular = editSeller.celular;
    }
    if (editSeller.direccion !== originalSeller.direccion) {
      updates.direccion = editSeller.direccion || null;
    }

    if (Object.keys(updates).length === 0) {
      setShowEditModal(false);
      return;
    }

    try {
      const response = await axios.patch(`http://localhost:3001/api/vendedores/${editSeller.id_vendedor}`, updates);
      setSellers(sellers.map(s => (s.id_vendedor === editSeller.id_vendedor ? { ...s, ...response.data } : s)));
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating seller:', err);
      const backendError = err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Error al actualizar el vendedor';
      setEditError(backendError);
    }
  };

  // Handle delete seller
  const handleDeleteSeller = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este vendedor?')) return;

    try {
      await axios.delete(`http://localhost:3001/api/vendedores/${id}`);
      setSellers(sellers.filter(s => s.id_vendedor !== id));
    } catch (err) {
      console.error('Error deleting seller:', err);
      setError('Error al eliminar el vendedor');
    }
  };

  return (
    <div className="py-4 px-3 sm:py-6 sm:px-4 md:py-8 md:px-6 bg-gradient-to-b from-gray-50 to-gray-200 min-h-screen relative">
      {/* Subtle Background Wave */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute top-0 w-full h-24 sm:h-32 md:h-48 text-gray-100" viewBox="0 0 1440 120" fill="currentColor">
          <path d="M0,0C240,40 480,80 720,80C960,80 1200,40 1440,0V120H0V0Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-12"
        >
          <div className="flex items-center space-x-3 sm:space-x-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 sm:p-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full"
            >
              <FaUser className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800">
              Gestionar Vendedores
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold text-xs sm:text-sm md:text-base hover:from-gray-900 hover:to-black transition duration-300 flex items-center gap-1 sm:gap-2"
            >
              <FaPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Añadir Vendedor</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/home')}
              className="px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold text-xs sm:text-sm md:text-base hover:bg-gray-300 transition duration-300"
            >
              Volver al Inicio
            </motion.button>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-600 text-white rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 text-center text-sm sm:text-base"
          >
            {error}
          </motion.div>
        )}

        {/* Add Seller Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 md:mb-8 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Añadir Nuevo Vendedor</h2>
              <motion.button
                whileHover={{ rotate: 90 }}
                onClick={() => {
                  setShowAddForm(false);
                  navigate('/seller');
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
              </motion.button>
            </div>
            {addError && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                <p className="text-sm sm:text-base">{addError}</p>
              </div>
            )}
            <form onSubmit={handleAddSeller} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-600 mb-1">Nombre del Vendedor</label>
                <motion.input
                  whileFocus={{ scale: 1.01, borderColor: "#111827" }}
                  type="text"
                  value={newSeller.nombre_vendedor}
                  onChange={(e) => setNewSeller({ ...newSeller, nombre_vendedor: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base"
                  placeholder="Ej. Juan Pérez"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-600 mb-1">DNI</label>
                <motion.input
                  whileFocus={{ scale: 1.01, borderColor: "#111827" }}
                  type="text"
                  value={newSeller.dni}
                  onChange={(e) => setNewSeller({ ...newSeller, dni: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base"
                  placeholder="Ej. 12345678"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-600 mb-1">Celular</label>
                <motion.input
                  whileFocus={{ scale: 1.01, borderColor: "#111827" }}
                  type="text"
                  value={newSeller.celular}
                  onChange={(e) => setNewSeller({ ...newSeller, celular: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base"
                  placeholder="Ej. 987654321"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-600 mb-1">Dirección (Opcional)</label>
                <motion.input
                  whileFocus={{ scale: 1.01, borderColor: "#111827" }}
                  type="text"
                  value={newSeller.direccion}
                  onChange={(e) => setNewSeller({ ...newSeller, direccion: e.target.value })}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base"
                  placeholder="Ej. Av. Principal 123"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold text-xs sm:text-sm md:text-base hover:from-gray-900 hover:to-black transition duration-300"
              >
                Guardar Vendedor
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* Sellers Table (Desktop) */}
        {loading ? (
          <div className="text-center py-6 sm:py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="inline-block"
            >
              <FaUser className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" />
            </motion.div>
            <p className="text-gray-600 mt-3 sm:mt-4 text-sm sm:text-base">Cargando vendedores...</p>
          </div>
        ) : sellers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6 sm:py-8 text-gray-600 text-sm sm:text-base md:text-lg"
          >
            No hay vendedores registrados.
          </motion.div>
        ) : (
          <div className="hidden sm:block bg-white rounded-2xl shadow-lg overflow-x-auto border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                <tr>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider">Nombre</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider">DNI</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider">Celular</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider">Dirección</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sellers.map((seller, index) => (
                  <motion.tr
                    key={seller.id_vendedor}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{seller.id_vendedor}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-800">{seller.nombre_vendedor}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-800">{seller.dni}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-800">{seller.celular}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-800">{seller.direccion || 'N/A'}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        onClick={() => handleEditSeller(seller)}
                        className="text-gray-600 hover:text-gray-800 mr-3 sm:mr-4 transition-colors duration-200"
                      >
                        <FaEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        onClick={() => handleDeleteSeller(seller.id_vendedor)}
                        className="text-gray-600 hover:text-red-600 transition-colors duration-200"
                      >
                        <FaTrash className="w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Card Layout for Sellers */}
        {sellers.length > 0 && (
          <div className="sm:hidden space-y-3">
            {sellers.map((seller, index) => (
              <motion.div
                key={seller.id_vendedor}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-lg p-4 border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">{seller.nombre_vendedor}</h3>
                    <p className="text-xs text-gray-600 mt-1">DNI: {seller.dni}</p>
                    <p className="text-xs text-gray-600 mt-1">Celular: {seller.celular}</p>
                    <p className="text-xs text-gray-600 mt-1">Dirección: {seller.direccion || 'N/A'}</p>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      onClick={() => handleEditSeller(seller)}
                      className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    >
                      <FaEdit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      onClick={() => handleDeleteSeller(seller.id_vendedor)}
                      className="text-gray-600 hover:text-red-600 transition-colors duration-200"
                    >
                      <FaTrash className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Edit Seller Modal */}
        <AnimatePresence>
          {showEditModal && editSeller && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center z-50 px-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 w-full max-w-md sm:max-w-lg mx-auto shadow-2xl border border-gray-200 overflow-y-auto max-h-[90vh]"
              >
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Editar Vendedor</h2>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.button>
                </div>
                {editError && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                    <p className="text-sm sm:text-base">{editError}</p>
                  </div>
                )}
                <form onSubmit={handleUpdateSeller} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-600 mb-1">Nombre del Vendedor</label>
                    <motion.input
                      whileFocus={{ scale: 1.01, borderColor: "#111827" }}
                      type="text"
                      value={editSeller.nombre_vendedor}
                      onChange={(e) => setEditSeller({ ...editSeller, nombre_vendedor: e.target.value })}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base"
                      placeholder="Ej. Juan Pérez"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-600 mb-1">DNI</label>
                    <motion.input
                      whileFocus={{ scale: 1.01, borderColor: "#111827" }}
                      type="text"
                      value={editSeller.dni}
                      onChange={(e) => setEditSeller({ ...editSeller, dni: e.target.value })}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base"
                      placeholder="Ej. 12345678"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-600 mb-1">Celular</label>
                    <motion.input
                      whileFocus={{ scale: 1.01, borderColor: "#111827" }}
                      type="text"
                      value={editSeller.celular}
                      onChange={(e) => setEditSeller({ ...editSeller, celular: e.target.value })}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base"
                      placeholder="Ej. 987654321"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-600 mb-1">Dirección (Opcional)</label>
                    <motion.input
                      whileFocus={{ scale: 1.01, borderColor: "#111827" }}
                      type="text"
                      value={editSeller.direccion || ''}
                      onChange={(e) => setEditSeller({ ...editSeller, direccion: e.target.value })}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base"
                      placeholder="Ej. Av. Principal 123"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold text-xs sm:text-sm md:text-base hover:from-gray-900 hover:to-black transition duration-300"
                  >
                    Actualizar Vendedor
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}