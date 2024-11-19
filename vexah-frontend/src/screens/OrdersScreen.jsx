import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import '../scss/OrdersScreen.scss'; // Crea un SCSS específico para Orders
import { getOrders } from '../services/orderApi'; // Supongamos que ya tienes este endpoint en tu backend
import { AuthContext } from '../context/AuthContext';
import banner from '../assets/banner.png';

const OrderScreen = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders(token); // Asegúrate de pasar el token
        setOrders(data);
      } catch (err) {
        setError(err.message || 'Error al cargar las órdenes');
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="orders-screen">
      {/* Header */}
      <div className="header-image">
        <button className="back-button" onClick={() => navigate('/')}>
          Volver
        </button>
        <img src={banner} alt="Banner" className="banner-image" />
      </div>

      {/* Main Section */}
      <div className="inventory-section">
        <h2 className="section-title">Listado de Órdenes</h2>
        {error && <p className="error">{error}</p>}
        <div className="order-list">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id_orden} className="order-item">
                <p><strong>ID Orden:</strong> {order.id_orden}</p>
                <p><strong>Cliente:</strong> {order.cliente?.nombre || 'N/A'}</p>
                <p><strong>Asesor:</strong> {order.asesor?.nombre || 'N/A'}</p>
                <p><strong>Total:</strong> ${order.total.toLocaleString()}</p>
                <p><strong>Fecha:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p className="no-orders">No hay órdenes registradas</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;
