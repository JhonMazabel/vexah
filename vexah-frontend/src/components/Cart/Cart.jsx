// src/components/Cart.jsx
import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { getCustomerByIdentification, createCustomer } from '../../services/customerApi';
import { createOrder, downloadOrderPDF } from '../../services/orderApi';
import '../../scss/Cart.scss';

const initialClientDataState = {
  nombre: '',
  identificacion: '',
  correo: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  estado: '',
  codigo_postal: '',
  pais: '',
};

const Cart = ({ cart, setCart, setRefresh }) => {
  const [identificacion, setIdentificacion] = useState('');
  const [cliente, setCliente] = useState(initialClientDataState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Incrementa la cantidad de un producto
  const handleIncrease = (productId) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id_producto === productId && item.quantity < item.stock
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrementa la cantidad de un producto, elimina si la cantidad llega a cero
  const handleDecrease = (productId) => {
    setCart((prevCart) =>
      prevCart.reduce((acc, item) => {
        if (item.id_producto === productId) {
          if (item.quantity > 1) {
            return [...acc, { ...item, quantity: item.quantity - 1 }];
          }
          return acc; // Si la cantidad es 1, se elimina el producto
        }
        return [...acc, item];
      }, [])
    );
  };

  // Maneja la búsqueda del cliente por identificación
  const handleBuscarCliente = async () => {
    try {
      setError(''); // Limpia los errores previos
      setSuccess(''); // Limpia los mensajes de éxito previos
      const response = await getCustomerByIdentification(identificacion);
      if (response) {
        setCliente(response);
      } else {
        setCliente({
          ...initialClientDataState,
          identificacion,
        });
      }
    } catch (error) {
      console.error('Error al buscar cliente:', error);
      setError('Cliente no encontrado. Por favor complete los datos del cliente.');
      setCliente({
        ...initialClientDataState,
        identificacion,
      });
    }
  };

  // Maneja los cambios en los campos del formulario del cliente
  const handleChangeCliente = (e) => {
    const { name, value } = e.target;
    setCliente((prevCliente) => ({
      ...prevCliente,
      [name]: value,
    }));
  };

  // Lógica para crear la orden
  const handleCreateOrder = async () => {
    try {
      setError(''); // Limpia los errores previos
      setSuccess(''); // Limpia los mensajes de éxito previos
      let clienteId;

      // Verifica si el cliente ya existe en la base de datos
      try {
        const clienteExistenteBD = await getCustomerByIdentification(cliente.identificacion);
        if (clienteExistenteBD) {
          // Si ya existe, usa el ID del cliente existente
          clienteId = clienteExistenteBD.id_cliente;
        } else {
          // Si no existe, crea un nuevo cliente
          const nuevoCliente = await createCustomer(cliente);
          clienteId = nuevoCliente.cliente.id_cliente;
        }
      } catch (error) {
        // Si hay un error (como un 404), crea un nuevo cliente
        if (error.response && error.response.status === 404) {
          const nuevoCliente = await createCustomer(cliente);
          clienteId = nuevoCliente.cliente.id_cliente;
        } else {
          throw error; // Si no es un 404, vuelve a lanzar el error
        }
      }

      // Estructura de datos para enviar al backend
      const orderDetails = cart.map((item) => ({
        id_producto: item.id_producto,
        cantidad: item.quantity,
      }));

      const orderData = {
        id_cliente: clienteId,
        productos: orderDetails,
      };

      // Crea la orden en el backend
      const response = await createOrder(orderData);
      console.log('Orden creada exitosamente:', response);

      // Después de crear la orden, descarga la factura en PDF usando el id_orden de la respuesta
      await downloadOrderPDF(response.orden.id_orden);

      // Limpia el carrito después de crear la orden
      setCart([]);
      setCliente(initialClientDataState);
      setIdentificacion('');

      // Actualiza el inventario
      setRefresh((prevRefresh) => !prevRefresh);

      // Mensaje de éxito
      setSuccess('Orden creada exitosamente. La factura se ha descargado.');

      // Desaparece el mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setSuccess('');
      }, 5000);
    } catch (error) {
      console.error('Error al crear la orden:', error);
      setError('Error al crear la orden. Por favor intente nuevamente.');

      // Desaparece el mensaje de error después de 5 segundos
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  // Formatear precio en moneda COP sin decimales
  const formatPrice = (price) => {
    return price.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <div className="cart-section">
      <h3>Carrito de Compras</h3>
      {cart.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        cart.map((item, index) => (
          <div key={index} className="cart-item">
            <p>{item.nombre_producto}</p>
            <div className="quantity-controls">
              <button
                onClick={() => handleDecrease(item.id_producto)}
                className="quantity-button"
              >
                <FaMinus />
              </button>
              <span className="quantity-display">{item.quantity}</span>
              <button
                onClick={() => handleIncrease(item.id_producto)}
                className="quantity-button"
              >
                <FaPlus />
              </button>
            </div>
            <p>{formatPrice(item.precio * item.quantity)}</p>
          </div>
        ))
      )}

      {cart.length > 0 && (
        <>
          <div className="customer-section">
            <h4>Datos del Cliente</h4>
            <div className="customer-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Número de Identificación"
                  value={identificacion}
                  onChange={(e) => setIdentificacion(e.target.value)}
                />
                <button className="buscar-cliente-button" onClick={handleBuscarCliente}>
                  Buscar Cliente
                </button>
              </div>
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="customer-details">
              {Object.keys(initialClientDataState).map((key) => (
                <div key={key} className="form-group">
                  <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  <input
                    type="text"
                    name={key}
                    value={cliente[key]}
                    onChange={handleChangeCliente}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Mensaje de éxito o error */}
          {success && <p className="text-success">{success}</p>}
          {error && <p className="text-danger">{error}</p>}

          <button className="create-order" onClick={handleCreateOrder}>
            Crear Orden
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;