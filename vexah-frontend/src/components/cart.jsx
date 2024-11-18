// src/components/Cart.jsx
import React from 'react';
import '../scss/Cart.scss';

const Cart = ({ cart, createOrder }) => {
  return (
    <div className="cart-section">
      <h3>Carrito de Compras</h3>
      {cart.length === 0 ? (
        <p>El carrito está vacío</p>
      ) : (
        cart.map((item, index) => (
          <div key={index} className="cart-item">
            <p>{item.nombre_producto} (x{item.quantity})</p>
            <p>${(item.precio * item.quantity).toFixed(2)}</p>
          </div>
        ))
      )}
      <button className="create-order" onClick={createOrder}>Crear Orden</button>
    </div>
  );
};

export default Cart;