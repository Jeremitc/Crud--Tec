import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const ProviderCard = ({ provider, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col space-y-3 border border-gray-200 hover:border-gray-300 transition-all duration-300"
    >
      <h3 className="text-base sm:text-lg font-bold text-gray-800">{provider.nombre_proveedor}</h3>
      <p className="text-xs sm:text-sm text-gray-600">
        <span className="font-semibold">Contacto:</span> {provider.nombre_contacto}
      </p>
      <p className="text-xs sm:text-sm text-gray-600">
        <span className="font-semibold">Celular:</span> {provider.celular}
      </p>
      <p className="text-xs sm:text-sm text-gray-600">
        <span className="font-semibold">Dirección:</span> {provider.direccion || 'N/A'}
      </p>
      <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onEdit(provider)}
          className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold text-xs sm:text-sm hover:bg-gray-300 transition duration-300 flex items-center gap-1 sm:gap-2"
        >
          <FaEdit className="text-gray-700 w-4 h-4 sm:w-5 sm:h-5" />
          <span>Editar</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(provider.id_proveedor)}
          className="px-3 py-1 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg font-semibold text-xs sm:text-sm hover:bg-red-500 transition duration-300 flex items-center gap-1 sm:gap-2"
        >
          <FaTrash className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Eliminar</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

const ProviderFormModal = ({ isOpen, onClose, onSubmit, provider, isEditing }) => {
  const [formData, setFormData] = useState({
    nombre_proveedor: provider?.nombre_proveedor || '',
    nombre_contacto: provider?.nombre_contacto || '',
    celular: provider?.celular || '',
    direccion: provider?.direccion || '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre_proveedor) newErrors.nombre_proveedor = 'El nombre es obligatorio';
    if (!formData.nombre_contacto) newErrors.nombre_contacto = 'El nombre de contacto es obligatorio';
    if (!formData.celular) newErrors.celular = 'El celular es obligatorio';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                {isEditing ? 'Editar Proveedor' : 'Añadir Proveedor'}
              </h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-600 mb-1">
                  Nombre del Proveedor
                </label>
                <input
                  type="text"
                  name="nombre_proveedor"
                  value={formData.nombre_proveedor}
                  onChange={handleChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base"
                />
                {errors.nombre_proveedor && (
                  <p className="text-red-500 text-xs mt-1">{errors.nombre_proveedor}</p>
                )}
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-600 mb-1">
                  Nombre de Contacto
                </label>
                <input
                  type="text"
                  name="nombre_contacto"
                  value={formData.nombre_contacto}
                  onChange={handleChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base"
                />
                {errors.nombre_contacto && (
                  <p className="text-red-500 text-xs mt-1">{errors.nombre_contacto}</p>
                )}
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-600 mb-1">
                  Celular
                </label>
                <input
                  type="text"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base"
                />
                {errors.celular && (
                  <p className="text-red-500 text-xs mt-1">{errors.celular}</p>
                )}
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-600 mb-1">
                  Dirección (Opcional)
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm sm:text-base"
                />
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6 justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold text-xs sm:text-sm hover:bg-gray-300 transition duration-300"
                >
                  Cancelar
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg font-semibold text-xs sm:text-sm hover:from-gray-900 hover:to-black transition duration-300"
                >
                  {isEditing ? 'Actualizar' : 'Añadir'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 w-full max-w-sm sm:max-w-md mx-auto shadow-2xl border border-gray-200"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              Confirmar Eliminación
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
              ¿Estás seguro de que deseas eliminar este proveedor? Esta acción no se puede deshacer.
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-3 py-1 sm:px-4 sm:py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold text-xs sm:text-sm hover:bg-gray-300 transition duration-300"
              >
                Cancelar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onConfirm}
                className="px-3 py-1 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg font-semibold text-xs sm:text-sm hover:bg-red-500 transition duration-300"
              >
                Eliminar
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function Providers() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [providerToDelete, setProviderToDelete] = useState(null);
  const [error, setError] = useState(null);

  // Fetch providers on mount
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/proveedores', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Fetch error response:', response.status, errorText);
          throw new Error(`Error al obtener los proveedores: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setProviders(data);
      } catch (err) {
        console.error('Fetch providers error:', err);
        setError(err.message);
      }
    };
    fetchProviders();
  }, []);

  const handleAddProvider = async (formData) => {
    try {
      const response = await fetch('http://localhost:3001/api/proveedores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al añadir el proveedor');
      }
      const newProvider = await response.json();
      setProviders([...providers, newProvider]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditProvider = async (formData) => {
    try {
      const response = await fetch(`http://localhost:3001/api/proveedores/${selectedProvider.id_proveedor}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el proveedor');
      }
      const updatedProvider = await response.json();
      setProviders(
        providers.map((provider) =>
          provider.id_proveedor === updatedProvider.id ? updatedProvider : provider
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProvider = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/proveedores/${providerToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el proveedor');
      }
      setProviders(providers.filter((provider) => provider.id_proveedor !== providerToDelete));
      setIsDeleteModalOpen(false);
      setProviderToDelete(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const openAddModal = () => {
    setSelectedProvider(null);
    setIsModalOpen(true);
  };

  const openEditModal = (provider) => {
    setSelectedProvider(provider);
    setIsModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setProviderToDelete(id);
    setIsDeleteModalOpen(true);
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-12"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800">
            Gestionar Proveedores
          </h1>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={openAddModal}
              className="px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold text-xs sm:text-sm md:text-base hover:from-gray-900 hover:to-black transition duration-300 flex items-center gap-1 sm:gap-2"
            >
              <FaPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Añadir Proveedor</span>
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

        {/* Providers List */}
        {providers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600 text-sm sm:text-base md:text-lg py-6 sm:py-8"
          >
            No hay proveedores registrados.
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {providers.map((provider) => (
              <ProviderCard
                key={provider.id_proveedor}
                provider={provider}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        <ProviderFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={selectedProvider ? handleEditProvider : handleAddProvider}
          provider={selectedProvider}
          isEditing={!!selectedProvider}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteProvider}
        />
      </div>
    </div>
  );
}