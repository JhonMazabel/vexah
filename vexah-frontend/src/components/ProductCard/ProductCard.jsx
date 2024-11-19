// src/components/ProductCard/ProductCard.jsx
import React from 'react';
import { FaCartPlus } from 'react-icons/fa';

// Imagen por defecto si no hay portada
const defaultPlaceholder = '/assets/placeholder.png';

// Formatear precio en moneda COP sin decimales
const formatPrice = (price) => {
  return price.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const ProductCard = ({ product, addToCart }) => {
  // Construye la URL completa de la imagen del producto
  const imageUrl = product.imagen_portada
    ? `http://localhost:3000/${product.imagen_portada}` // Cambia localhost:3000 si usas otro host
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
        <p><strong>Precio:</strong> {formatPrice(product.precio)}</p>
        <p><strong>Stock disponible:</strong> {product.stock}</p>
        <button onClick={() => addToCart(product)} className="add-to-cart">
          <FaCartPlus /> Agregar
        </button>
      </div>
    </div>
  );
};

export default ProductCard;