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
          throw new Error('Cliente no encontrado');
        }
      } catch (error) {
        // Si el cliente no existe, crea uno nuevo
        if (error.message === 'Cliente no encontrado' || (error.response && error.response.status === 404)) {
          const nuevoCliente = await createCustomer(cliente);
          clienteId = nuevoCliente.cliente.id_cliente;
        } else {
          throw error; // Si no es un error de cliente no encontrado, vuelve a lanzar el error
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

  // Calcular el total del carrito
  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + item.precio * item.quantity, 0);
  };

  return (
    <div className="cart-section">
      <h3>Gestión de Ordenes</h3>
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
          <div className="cart-total">
            <h4>Total: {formatPrice(calculateTotal())}</h4>
          </div>

          <div className="customer-section">
            <h4>Datos del Cliente</h4>

            <div className="customer-form">
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

            {error && <p className="error-message">{error}</p>}
            <p> - Los campos marcados con (*) son obligatorios</p>
            <div className="customer-details">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre(*)"
                value={cliente.nombre}
                onChange={handleChangeCliente}
                required
              />
              <input
                type="text"
                name="identificacion"
                placeholder="Identificación(*)"
                value={cliente.identificacion}
                onChange={handleChangeCliente}
                required
              />
              <input
                type="text"
                name="correo"
                placeholder="Correo Electrónico(*)"
                value={cliente.correo}
                onChange={handleChangeCliente}
                required
              />
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono(*)"
                value={cliente.telefono}
                onChange={handleChangeCliente}
                required
              />
              <input
                type="text"
                name="direccion"
                placeholder="Dirección(*)"
                value={cliente.direccion}
                onChange={handleChangeCliente}
                required
              />
              <input
                type="text"
                name="ciudad"
                placeholder="Ciudad(*)"
                value={cliente.ciudad}
                onChange={handleChangeCliente}
                required
              />
              <input
                type="text"
                name="estado"
                placeholder="Estado(*)"
                value={cliente.estado}
                onChange={handleChangeCliente}
                required
              />
              <input
                type="text"
                name="codigo_postal"
                placeholder="Código Postal"
                value={cliente.codigo_postal}
                onChange={handleChangeCliente}
                required
              />
              <input
                type="text"
                name="pais"
                placeholder="País"
                value={cliente.pais}
                onChange={handleChangeCliente}
                required
              />
            </div>
          </div>

          <button className="create-order" onClick={handleCreateOrder}>
            Crear Orden
          </button>
        </>
      )}

      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Cart;