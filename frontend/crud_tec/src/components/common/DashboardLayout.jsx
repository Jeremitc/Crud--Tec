import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../common/SideBar';
import { FaBars } from 'react-icons/fa';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen md:flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <main className="flex-1 w-full">
        {/* Hamburger Button (visible only on mobile) */}
        <div className="p-4 md:hidden sticky top-0 bg-gray-100 z-30">
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-600 bg-white rounded-md shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            aria-label="Abrir menú"
          >
            <FaBars className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;