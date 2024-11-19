import React, { useState, useEffect } from 'react';

const ProductModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    id_producto: initialData?.id_producto || null,
    nombre_producto: initialData?.nombre_producto || '',
    precio: initialData?.precio || '',
    stock: initialData?.stock || '',
    descripcion: initialData?.descripcion || '',
    imagen_portada: null,
  });

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
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          width: '90%',
          maxWidth: '500px',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          animation: 'fadeIn 0.3s ease-in-out',
        }}
      >
        <h3
          style={{
            marginBottom: '20px',
            color: '#4A90E2',
            textAlign: 'center',
            fontSize: '1.5rem',
          }}
        >
          {initialData ? 'Editar Producto' : 'Agregar Producto'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ fontWeight: 'bold', marginBottom: '5px', color: '#4A90E2' }}>Nombre</label>
            <input
              type="text"
              name="nombre_producto"
              value={formData.nombre_producto}
              onChange={handleChange}
              required
              style={{
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                fontSize: '1rem',
                outline: 'none',
                width: '100%',
              }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 'bold', marginBottom: '5px', color: '#4A90E2' }}>Precio</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              required
              style={{
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                fontSize: '1rem',
                outline: 'none',
                width: '100%',
              }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 'bold', marginBottom: '5px', color: '#4A90E2' }}>Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              style={{
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                fontSize: '1rem',
                outline: 'none',
                width: '100%',
              }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 'bold', marginBottom: '5px', color: '#4A90E2' }}>Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              style={{
                padding: '10px',
                border: '1px solid #ccc',
                borderRadius: '5px',
                fontSize: '1rem',
                outline: 'none',
                width: '100%',
                resize: 'none',
                height: '100px',
              }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 'bold', marginBottom: '5px', color: '#4A90E2' }}>Imagen</label>
            <input
              type="file"
              name="imagen_portada"
              onChange={handleFileChange}
              accept="image/*"
              style={{ padding: '5px', border: 'none', width: '100%' }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '10px',
            }}
          >
            <button
              type="submit"
              style={{
                padding: '10px 15px',
                borderRadius: '5px',
                fontWeight: 'bold',
                fontSize: '1rem',
                backgroundColor: '#4A90E2',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              Guardar
            </button>
            <button
              onClick={onClose}
              type="button"
              style={{
                padding: '10px 15px',
                borderRadius: '5px',
                fontWeight: 'bold',
                fontSize: '1rem',
                backgroundColor: '#E24A4A',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
