import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../auth/auth_context';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaTruckLoading, FaUserTie, FaPlusCircle, FaListAlt, FaChartBar, FaHistory } from 'react-icons/fa';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const StatCard = ({ icon, title, value, color }) => {
  const IconComponent = icon;
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value || 0;
    const duration = 1500; // Animation duration in ms
    const increment = end / (duration / 60); // Increment per frame (60fps)

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(counter);
      }
      setCount(Math.floor(start));
    }, 1000 / 60);

    return () => clearInterval(counter);
  }, [value]);

  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-6 flex items-center space-x-4 border border-gray-200 hover:border-gray-300 transition-all duration-300"
    >
      <motion.div
        whileHover={{ rotate: 10 }}
        className={`p-4 rounded-full ${color} shadow-lg`}
      >
        <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
      </motion.div>
      <div>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
        <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">{count}</p>
      </div>
    </motion.div>
  );
};

const ActionCard = ({ icon, title, description, linkTo, linkText }) => {
  const IconComponent = icon;
  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-6 flex flex-col justify-between border border-gray-200 hover:border-gray-300 transition-all duration-300 group"
    >
      <div>
        <div className="flex items-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-gray-700 mr-3 group-hover:text-gray-900 transition-colors duration-200" />
          </motion.div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 tracking-tight">{title}</h3>
        </div>
        <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">{description}</p>
      </div>
      <Link
        to={linkTo}
        className="mt-auto inline-block text-center px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-sm sm:text-base font-semibold rounded-lg shadow-md hover:from-gray-900 hover:to-black transition-all duration-300"
      >
        {linkText}
      </Link>
      {/* Tooltip on hover */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-2 right-2 bg-gray-800 text-white text-xs rounded-lg px-2 py-1 shadow-lg"
      >
        {linkText}
      </motion.div>
    </motion.div>
  );
};

const RecentActivity = () => {
  const activities = [
    { id: 1, action: "Producto 'Laptop Pro' añadido", time: "Hace 2 horas" },
    { id: 2, action: "Stock de 'Smartphone X' actualizado", time: "Hace 5 horas" },
    { id: 3, action: "Producto 'Tablet Air' eliminado", time: "Ayer" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200"
    >
      <div className="flex items-center mb-4 sm:mb-6">
        <FaHistory className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700 mr-3" />
        <h3 className="text-xl sm:text-2xl font-bold text-gray-700 tracking-tight">Actividad Reciente</h3>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between border-l-4 border-gray-300 pl-4 py-2"
          >
            <div>
              <p className="text-sm sm:text-base text-gray-800">{activity.action}</p>
              <p className="text-xs sm:text-sm text-gray-500">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const StockChart = () => {
  const data = {
    labels: ['Laptop Pro', 'Smartphone X', 'Tablet Air', 'Monitor 4K', 'Teclado Mecánico'],
    datasets: [
      {
        label: 'Stock',
        data: [50, 30, 20, 10, 40],
        backgroundColor: 'rgba(55, 65, 81, 0.8)',
        borderColor: 'rgba(55, 65, 81, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Niveles de Stock',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: '#374151',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Unidades',
          color: '#374151',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Productos',
          color: '#374151',
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200"
    >
      <div className="h-64 sm:h-80">
        <Bar data={data} options={options} />
      </div>
    </motion.div>
  );
};



export default function Home() {
  const { user } = useAuth();

  // Placeholder data (you can fetch real data later)
  const totalProducts = 0;
  const totalProviders = 0;
  const totalSellers = 0;

  // Typing animation for the subtitle
  const [subtitle, setSubtitle] = useState('');
  const fullSubtitle = 'Bienvenido a tu centro de operaciones. Aquí tienes un resumen rápido para empezar.';
  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullSubtitle.length) {
        setSubtitle(fullSubtitle.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="py-6 px-4 sm:py-8 sm:px-6 bg-gradient-to-b from-gray-50 to-gray-200 min-h-screen relative max-w-7xl mx-auto">
      {/* Subtle Background Wave */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute top-0 w-full h-32 sm:h-48 text-gray-100" viewBox="0 0 1440 120" fill="currentColor">
          <path d="M0,0C240,40 480,80 720,80C960,80 1200,40 1440,0V120H0V0Z" />
        </svg>
      </div>



      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8 sm:mb-10 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-200 z-10"
      >
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">
            ¡Hola,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-900">
              {user?.nombre_usuario || user?.correo || 'Usuario'}
            </span>
            !
          </h1>
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <span className="text-2xl sm:text-3xl md:text-4xl">👋</span>
          </motion.div>
        </div>
        <p className="text-sm sm:text-md text-gray-600 mt-2 sm:mt-3 leading-relaxed">{subtitle}</p>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8 sm:mb-10"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4 sm:mb-6 tracking-tight">Estadísticas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <StatCard
            icon={FaBoxOpen}
            title="Total Productos"
            value={totalProducts}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <StatCard
            icon={FaTruckLoading}
            title="Total Proveedores"
            value={totalProviders}
            color="bg-gradient-to-r from-green-500 to-green-600"
          />
          <StatCard
            icon={FaUserTie}
            title="Total Vendedores"
            value={totalSellers}
            color="bg-gradient-to-r from-purple-500 to-purple-600"
          />
        </div>
      </motion.div>

      {/* Quick Actions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-8 sm:mb-10"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-4 sm:mb-6 tracking-tight">Accesos Rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <ActionCard
            icon={FaPlusCircle}
            title="Añadir Producto"
            description="Registra un nuevo artículo en tu inventario para mantenerlo actualizado."
            linkTo="/products#add"
            linkText="Añadir Ahora"
          />
          <ActionCard
            icon={FaListAlt}
            title="Ver Inventario"
            description="Consulta la lista completa de tus productos en un solo lugar."
            linkTo="/products"
            linkText="Ver Productos"
          />
          <ActionCard
            icon={FaChartBar}
            title="Próximamente..."
            description="Más funcionalidades y reportes estarán disponibles aquí muy pronto."
            linkTo="/home"
            linkText="Explorar"
          />
        </div>
      </motion.div>

      {/* Stock Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mb-8 sm:mb-10"
      >
        <StockChart />
      </motion.div>

      {/* Recent Activity Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <RecentActivity />
      </motion.div>
    </div>
  );
}