// src/screens/ProductsScreen.jsx
import React, { useState } from 'react';
import '../scss/ProductsScreen.scss';

const ProductsScreen = () => {
  const [cart, setCart] = useState([]);
  
  // Función para agregar productos al carrito
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  // Lista de productos de ejemplo (podrías obtenerlos de una API)
  const products = [
    { id: 1, name: 'Producto 1', price: 100, image: 'link_imagen_1' },
    { id: 2, name: 'Producto 2', price: 200, image: 'link_imagen_2' },
    { id: 3, name: 'Producto 3', price: 300, image: 'link_imagen_3' },
  ];

  return (
    <div className="products-screen">
      {/* Imagen que desaparece al hacer scroll */}
      <div className="header-image">
        <button className="back-button">Volver</button>
        <div className="main-image">Imagen X</div>
      </div>

      {/* Área de inventario y opciones de filtro */}
      <div className="inventory-section">
        <div className="filter-options">
          <input type="text" placeholder="Buscar por nombre" />
          <button>Ordenar por precio</button>
        </div>

        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <p>{product.name}</p>
              <p>Valor: ${product.price}</p>
              <button onClick={() => addToCart(product)}>Agregar</button>
            </div>
          ))}
        </div>
      </div>

      {/* Carrito de compras siempre visible */}
      <div className="cart-section">
        <h3>Carrito de Compras</h3>
        {cart.map((item, index) => (
          <div key={index} className="cart-item">
            <p>{item.name} - ${item.price}</p>
          </div>
        ))}
        <button className="create-order">Crear Orden</button>
      </div>
    </div>
  );
};

export default ProductsScreen;
