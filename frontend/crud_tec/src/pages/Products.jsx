import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaEdit, FaTrash, FaTimes, FaPlus, FaBoxOpen } from 'react-icons/fa';

export default function Products() {
  const navigate = useNavigate();
  const location = useLocation();

  // State for products list
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for add product form
  const [showAddForm, setShowAddForm] = useState(location.hash === '#add');
  const [newProduct, setNewProduct] = useState({ nombre_producto: '', precio: '', stock: '' });
  const [addError, setAddError] = useState('');

  // State for edit product modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editError, setEditError] = useState('');

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/productos');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Error al obtener los productos');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle showing the add form based on URL hash
  useEffect(() => {
    setShowAddForm(location.hash === '#add');
  }, [location.hash]);

  // Handle add product form submission
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAddError('');

    try {
      const response = await axios.post('http://localhost:3001/api/productos', newProduct);
      setProducts([...products, response.data]);
      setNewProduct({ nombre_producto: '', precio: '', stock: '' });
      setShowAddForm(false);
      navigate('/products');
    } catch (err) {
      console.error('Error adding product:', err);
      const backendError = err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Error al crear el producto';
      setAddError(backendError);
    }
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    setEditProduct({ ...product });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setEditError('');

    const updates = {};
    if (editProduct.nombre_producto !== products.find(p => p.id_producto === editProduct.id_producto).nombre_producto) {
      updates.nombre_producto = editProduct.nombre_producto;
    }
    if (editProduct.precio !== products.find(p => p.id_producto === editProduct.id_producto).precio) {
      updates.precio = editProduct.precio;
    }
    if (editProduct.stock !== products.find(p => p.id_producto === editProduct.id_producto).stock) {
      updates.stock = editProduct.stock;
    }

    if (Object.keys(updates).length === 0) {
      setShowEditModal(false);
      return;
    }

    try {
      const response = await axios.patch(`http://localhost:3001/api/productos/${editProduct.id_producto}`, updates);
      setProducts(products.map(p => (p.id_producto === editProduct.id_producto ? { ...p, ...response.data } : p)));
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating product:', err);
      const backendError = err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Error al actualizar el producto';
      setEditError(backendError);
    }
  };

  // Handle delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      await axios.delete(`http://localhost:3001/api/productos/${id}`);
      setProducts(products.filter(p => p.id_producto !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Error al eliminar el producto');
    }
  };

  return (
    <div className="py-6 px-4 sm:py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 sm:p-3 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full"
            >
              <FaBoxOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Gestiona tus <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900">Productos</span>
            </h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold shadow-lg hover:from-gray-900 hover:to-black transition-all duration-300 flex items-center justify-center w-full sm:w-auto"
          >
            <FaPlus className="mr-2 w-4 h-4 sm:w-5 sm:h-5" /> Añadir Producto
          </motion.button>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 sm:p-4 rounded-lg mb-6 sm:mb-8 shadow-md"
          >
            <p className="text-sm sm:text-base">{error}</p>
          </motion.div>
        )}

        {/* Add Product Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-2xl p-6 sm:p-8 mb-6 sm:mb-8 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">Añadir Nuevo Producto</h2>
              <motion.button
                whileHover={{ rotate: 90 }}
                onClick={() => {
                  setShowAddForm(false);
                  navigate('/products');
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
            <form onSubmit={handleAddProduct} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Nombre del Producto</label>
                <motion.input
                  whileFocus={{ scale: 1.01, borderColor: "#111827" }}
                  type="text"
                  value={newProduct.nombre_producto}
                  onChange={(e) => setNewProduct({ ...newProduct, nombre_producto: e.target.value })}
                  className="w-full px-4 py-2 sm:px-5 sm:py-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200 text-sm sm:text-base"
                  placeholder="Ej. Laptop Pro"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Precio</label>
                <motion.input
                  whileFocus={{ scale: 1.01, borderColor: "#111827" }}
                  type="number"
                  step="0.01"
                  value={newProduct.precio}
                  onChange={(e) => setNewProduct({ ...newProduct, precio: e.target.value })}
                  className="w-full px-4 py-2 sm:px-5 sm:py-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200 text-sm sm:text-base"
                  placeholder="Ej. 999.99"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Stock</label>
                <motion.input
                  whileFocus={{ scale: 1.01, borderColor: "#111827" }}
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="w-full px-4 py-2 sm:px-5 sm:py-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200 text-sm sm:text-base"
                  placeholder="Ej. 50"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold shadow-lg hover:from-gray-900 hover:to-black transition-all duration-300 text-sm sm:text-base"
              >
                Guardar Producto
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* Products Table */}
        {loading ? (
          <div className="text-center py-8 sm:py-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="inline-block"
            >
              <FaBoxOpen className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" />
            </motion.div>
            <p className="text-gray-600 mt-3 sm:mt-4 text-sm sm:text-base">Cargando productos...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 sm:py-10 bg-white rounded-2xl shadow-lg">
            <FaBoxOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <p className="text-gray-600 text-base sm:text-lg">No hay productos disponibles.</p>
            <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">¡Añade tu primer producto ahora!</p>
          </div>
        ) : (
          <div className="hidden sm:block bg-white rounded-2xl shadow-2xl overflow-x-auto border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                <tr>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider">Nombre</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider">Precio</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-xs font-semibold uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product, index) => (
                  <motion.tr
                    key={product.id_producto}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{product.id_producto}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-800">{product.nombre_producto}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-800">${parseFloat(product.precio).toFixed(2)}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-800">
                      <span className={`inline-block px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        onClick={() => handleEditProduct(product)}
                        className="text-gray-600 hover:text-gray-800 mr-3 sm:mr-4 transition-colors duration-200"
                      >
                        <FaEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.2 }}
                        onClick={() => handleDeleteProduct(product.id_producto)}
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

        {/* Mobile Card Layout for Products */}
        {products.length > 0 && (
          <div className="sm:hidden space-y-4">
            {products.map((product, index) => (
              <motion.div
                key={product.id_producto}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-lg p-4 border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">{product.nombre_producto}</h3>
                    <p className="text-xs text-gray-600 mt-1">Precio: ${parseFloat(product.precio).toFixed(2)}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Stock: <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.stock}
                      </span>
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      onClick={() => handleEditProduct(product)}
                      className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    >
                      <FaEdit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.2 }}
                      onClick={() => handleDeleteProduct(product.id_producto)}
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

      </motion.div>

      {/* Edit Product Modal */}
      {showEditModal && editProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-b from-white to-gray-50 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">Editar Producto</h2>
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
            <form onSubmit={handleUpdateProduct} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Nombre del Producto</label>
                <motion.input
                  whileFocus={{ scale: 1.01, borderColor: "#111827" }}
                  type="text"
                  value={editProduct.nombre_producto}
                  onChange={(e) => setEditProduct({ ...editProduct, nombre_producto: e.target.value })}
                  className="w-full px-4 py-2 sm:px-5 sm:py-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200 text-sm sm:text-base"
                  placeholder="Nombre del producto"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Precio</label>
                <motion.input
                  whileFocus={{ scale: 1.01, borderColor: "#111827" }}
                  type="number"
                  step="0.01"
                  value={editProduct.precio}
                  onChange={(e) => setEditProduct({ ...editProduct, precio: e.target.value })}
                  className="w-full px-4 py-2 sm:px-5 sm:py-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200 text-sm sm:text-base"
                  placeholder="Precio"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Stock</label>
                <motion.input
                  whileFocus={{ scale: 1.01, borderColor: "#111827" }}
                  type="number"
                  value={editProduct.stock}
                  onChange={(e) => setEditProduct({ ...editProduct, stock: e.target.value })}
                  className="w-full px-4 py-2 sm:px-5 sm:py-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder-gray-500 shadow-sm transition-all duration-200 text-sm sm:text-base"
                  placeholder="Stock"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold shadow-lg hover:from-gray-900 hover:to-black transition-all duration-300 text-sm sm:text-base"
              >
                Actualizar Producto
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}