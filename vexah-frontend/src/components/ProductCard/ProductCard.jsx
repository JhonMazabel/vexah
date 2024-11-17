// src/components/ProductCard.jsx
import React from 'react';

// Imagen por defecto si no hay portada
const defaultPlaceholder = '/assets/placeholder.png';

const ProductCard = ({ product, addToCart }) => {
  // Construye la URL completa de la imagen del producto
  const imageUrl = product.imagen_portada
    ? `http://localhost:3000${product.imagen_portada}` // Cambia localhost:3000 si usas otro host
    : defaultPlaceholder;

  return (
    <div className="product-card">
      <img
        src={imageUrl}
        alt={product.nombre_producto}
        className="product-image"
      />
      <div className="product-details">
        <h4>{product.nombre_producto}</h4>
        <p>{product.descripcion || 'Sin descripción'}</p>
        <p><strong>Precio:</strong> ${product.precio.toFixed(2)}</p>
        <button onClick={() => addToCart(product)}>Agregar</button>
      </div>
    </div>
  );
};

export default ProductCard;
