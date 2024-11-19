// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';

import LoginScreen from './screens/LoginScreen';
import ProductsScreen from './screens/ProductsScreen';
import OrdersScreen from './screens/OrdersScreen';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginScreen />} /> {/* Muestra LoginScreen como página principal */}
          <Route path="/products" element={<ProductsScreen />} /> {/* Página independiente para Ver Productos */}
          <Route path="/orders" element={<OrdersScreen />} /> {/* Página independiente para Ver Productos */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
