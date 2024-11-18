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

const Cart = ({ cart, setCart }) => {
  const [identificacion, setIdentificacion] = useState('');
  const [cliente, setCliente] = useState(initialClientDataState);
  const [clienteExistente, setClienteExistente] = useState(false);

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
      const response = await getCustomerByIdentification(identificacion);
      if (response) {
        setCliente(response);
        setClienteExistente(true);
      } else {
        setClienteExistente(false);
        setCliente({
          nombre: '',
          identificacion,
          correo: '',
          telefono: '',
          direccion: '',
          ciudad: '',
          estado: '',
          codigo_postal: '',
          pais: '',
        });
      }
    } catch (error) {
      console.error('Error al buscar cliente:', error);
      setCliente({
        nombre: '',
        identificacion: '',
        correo: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        estado: '',
        codigo_postal: '',
        pais: '',
      });
      setClienteExistente(false);
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
      let clienteId;

      // Verifica si el cliente ya existe
      if (!clienteExistente) {
        // Si no existe, crea un nuevo cliente
        const nuevoCliente = await createCustomer(cliente);
        console.log({nuevoCliente});
        clienteId = nuevoCliente.cliente.id_cliente;
      } else {
        // Si ya existe, usa el ID del cliente existente
        clienteId = cliente.id_cliente;
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
      setCliente({
        nombre: '',
        identificacion: '',
        correo: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        estado: '',
        codigo_postal: '',
        pais: '',
      });
      setClienteExistente(false);
      setIdentificacion('');
    } catch (error) {
      console.error('Error al crear la orden:', error);
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
              <input
                type="text"
                placeholder="Número de Identificación"
                value={identificacion}
                onChange={(e) => setIdentificacion(e.target.value)}
              />
              <button onClick={handleBuscarCliente}>Buscar Cliente</button>
            </div>
            <div className="customer-details">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={cliente.nombre}
                onChange={handleChangeCliente}
                required
              />
              <input
                type="text"
                name="identificacion"
                placeholder="Identificación"
                value={cliente.identificacion}
                onChange={handleChangeCliente}
                required
              />
              <input
                type="text"
                name="correo"
                placeholder="Correo Electrónico"
                value={cliente.correo}
                onChange={handleChangeCliente}
                required
              />
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                value={cliente.telefono}
                onChange={handleChangeCliente}
                required
              />
              <input
                type="text"
                name="direccion"
                placeholder="Dirección"
                value={cliente.direccion}
                onChange={handleChangeCliente}
                required
              />
              <input
                type="text"
                name="ciudad"
                placeholder="Ciudad"
                value={cliente.ciudad}
                onChange={handleChangeCliente}
                required
              />
              <input
                type="text"
                name="estado"
                placeholder="Estado"
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
    </div>
  );
};

export default Cart;