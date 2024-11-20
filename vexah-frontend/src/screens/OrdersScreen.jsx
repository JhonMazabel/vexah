import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders, exportOrdersPDF, downloadOrderPDF } from '../services/orderApi';
import { AuthContext } from '../context/AuthContext';
import '../scss/OrdersScreen.scss';
import banner from '../assets/banner.png';

const OrderScreen = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const data = await getOrders(token);
        setOrders(data);
      } catch (err) {
        setError(err.message || 'Error al cargar las órdenes');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDownloadPDF = async (orderId) => {
    try {
      await downloadOrderPDF(orderId);
    } catch (err) {
      console.error('Error al descargar el PDF:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="orders-screen">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-screen">
      <header className="header">
        <button className="back-button" onClick={() => navigate('/')}>
          <span className="icon">←</span>
          <span>Volver</span>
        </button>
        <img src={banner} alt="Banner" className="banner-image" />
      </header>

      <div className="actions">
        <button className="export-pdf-button" onClick={exportOrdersPDF}>
          Exportar PDF General
        </button>
      </div>

      <main className="main-content">
        <div className="orders-container">
          <h2 className="section-title">Listado de Órdenes</h2>

          {error && (
            <div className="error-message">
              <span className="icon">⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {orders.length > 0 ? (
            <div className="table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ID Orden</th>
                    <th>Cliente</th>
                    <th>Asesor</th>
                    <th>Total</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id_orden}>
                      <td className="order-id">{order.id_orden}</td>
                      <td>{order.Customer?.nombre || 'N/A'}</td>
                      <td>{order.User?.nombre || 'N/A'}</td>
                      <td className="total">{formatCurrency(order.total)}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(order.createdAt).toLocaleTimeString()}</td>
                      <td>
                        <button
                          className="btn btn-download"
                          onClick={() => handleDownloadPDF(order.id_orden)}
                        >
                          Descargar PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-orders">
              <span className="icon">📋</span>
              <p>No hay órdenes registradas</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderScreen;