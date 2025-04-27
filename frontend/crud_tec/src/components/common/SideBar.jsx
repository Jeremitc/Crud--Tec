import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../auth/auth_context';
import { FaUserCircle, FaBoxOpen, FaTruckLoading, FaUserTie, FaSignOutAlt, FaTimes, FaHome } from 'react-icons/fa';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const navItems = [
    { path: '/home', label: 'Inicio', icon: FaHome },
    { path: '/products', label: 'Productos', icon: FaBoxOpen },
    { path: '/provider', label: 'Proveedores', icon: FaTruckLoading },
    { path: '/seller', label: 'Vendedores', icon: FaUserTie },
  ];

  const linkClasses = "flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200";
  const activeLinkClasses = "bg-gray-700 text-white";
  const sidebarVariants = { closed: { x: "-100%" }, open: { x: 0 } };
  const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

  return (
    <AnimatePresence>
      {/* Overlay for mobile */}
      {isOpen && (
        <motion.div
          key="overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-60 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.div
        key="sidebar"
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
        className="fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white flex flex-col shadow-lg z-50 md:sticky md:!translate-x-0 md:h-screen md:border-r md:border-gray-700"
      >
        {/* Close Button (mobile only) */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-gray-400 hover:text-white md:hidden z-50"
          aria-label="Cerrar menú"
        >
          <FaTimes className="w-6 h-6" />
        </button>

        {/* User Section */}
        <div className="flex flex-col items-center p-6 mt-8 md:mt-0 border-b border-gray-700">
          <FaUserCircle className="w-16 h-16 text-gray-500 mb-3" />
          <h2 className="text-lg font-semibold truncate w-full text-center">
            {user?.nombre_usuario || user?.correo || 'Usuario'}
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={toggleSidebar}
              className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-gray-700">
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200 w-full"
          >
            <FaSignOutAlt className="w-5 h-5 mr-3" />
            Cerrar Sesión
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Sidebar;