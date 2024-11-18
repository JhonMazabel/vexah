// src/components/ProductCard.jsx
import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

// Imagen por defecto si no hay portada
const defaultPlaceholder = '/assets/placeholder.png';

const ProductCard = ({ product, addToCart }) => {
  // Construye la URL completa de la imagen del producto
  const imageUrl = product.imagen_portada
    ? `http://localhost:3000${product.imagen_portada}` // Cambia localhost:3000 si usas otro host
    : defaultPlaceholder;

  // Estado para la cantidad seleccionada
  const [quantity, setQuantity] = useState(1);

  // Maneja el incremento de la cantidad
  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  // Maneja la disminución de la cantidad
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

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
        <p><strong>Stock disponible:</strong> {product.stock}</p>
        <div className="quantity-selector">
          <button onClick={handleDecrease} disabled={quantity === 1} className="quantity-button">
            <FaMinus />
          </button>
          <span className="quantity-display">{quantity}</span>
          <button onClick={handleIncrease} disabled={quantity === product.stock} className="quantity-button">
            <FaPlus />
          </button>
        </div>
        <button onClick={() => addToCart({ ...product, quantity })} className="add-to-cart">
          Agregar
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
