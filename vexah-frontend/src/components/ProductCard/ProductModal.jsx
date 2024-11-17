// src/components/ProductModal.jsx
import React, { useState, useEffect } from 'react';

const ProductModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  // Incluir `id_producto` en `formData` si se está editando un producto
  const [formData, setFormData] = useState({
    id_producto: initialData?.id_producto || null,
    nombre_producto: initialData?.nombre_producto || '',
    precio: initialData?.precio || '',
    stock: initialData?.stock || '',
    descripcion: initialData?.descripcion || '',
    imagen_portada: null,
  });

  // Actualizar `formData` si `initialData` cambia (cuando seleccionas un producto diferente para editar)
  useEffect(() => {
    if (initialData) {
      setFormData({
        id_producto: initialData.id_producto,
        nombre_producto: initialData.nombre_producto,
        precio: initialData.precio,
        stock: initialData.stock,
        descripcion: initialData.descripcion,
        imagen_portada: null,
      });
    } else {
      // Restablecer el formulario si no hay `initialData` (por ejemplo, al agregar un nuevo producto)
      setFormData({
        id_producto: null,
        nombre_producto: '',
        precio: '',
        stock: '',
        descripcion: '',
        imagen_portada: null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imagen_portada: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pasar `formData` al `onSubmit`, que incluye el `id_producto` si está presente
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3>{initialData ? 'Editar Producto' : 'Agregar Producto'}</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre</label>
            <input
              type="text"
              name="nombre_producto"
              value={formData.nombre_producto}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Precio</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Imagen</label>
            <input
              type="file"
              name="imagen_portada"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
            <button onClick={onClose} className="btn btn-secondary" type="button">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
