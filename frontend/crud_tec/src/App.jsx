import React from 'react';
import './Styles/globals.css';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/protected/ProtectedRoute';
//import de paginas
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Products from './pages/Products';
import Provider from './pages/Provider';
import Seller from './pages/Seller';
import NotFound from './pages/NotFound';



function App() {
  return (
    <Routes>
      {/* Rutas Publicas */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Rutas Privadas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/provider" element={<Provider />} />
        <Route path="/seller" element={<Seller />} />
        <Route path="*" element={<NotFound />} />
        </Route>
    </Routes>
  );
}

export default App;
