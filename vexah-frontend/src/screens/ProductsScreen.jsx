import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import ProductCard from '../components/ProductCard/ProductCard';
import Cart from '../components/Cart/Cart';

import { getActiveProducts, createProduct, deleteProduct, updateProduct } from '../services/productApi';
import { AuthContext } from '../context/AuthContext';

import banner from '../assets/banner.png';
import Modal from 'react-modal'; // Asegúrate de instalar react-modal
import '../scss/ProductsScreen.scss';

Modal.setAppElement('#root'); // Especifica el elemento app para evitar advertencias de accesibilidad

const ProductsScreen = () => {
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getActiveProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message || 'Error al cargar productos');
      }
    };
    fetchProducts();
  }, [refresh]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id_producto === product.id_producto);
      
      if (existingProduct) {
        // Si el producto ya está en el carrito, aumenta la cantidad si no supera el stock
        if (existingProduct.quantity < product.stock) {
          return prevCart.map((item) =>
            item.id_producto === product.id_producto
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return prevCart;
        }
      } else {
        // Si el producto no está en el carrito, agrégalo
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const handleCreateProduct = async (productData) => {
    try {
      await createProduct(productData, token);
      setRefresh(!refresh);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error al crear producto:', err);
    }
  };

  const handleUpdateProduct = async (productId, productData) => {
    try {
      if (!productId) {
        console.error("ID del producto no proporcionado para actualizar.");
        return;
      }
      await updateProduct(productId, productData, token);
      setRefresh(!refresh);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error al actualizar producto:', err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      if (!productId) {
        console.error("ID del producto no proporcionado para eliminar.");
        return;
      }
      await deleteProduct(productId, token);
      setRefresh(!refresh);
    } catch (err) {
      console.error('Error al eliminar producto:', err);
    }
  };

  return (
    <div className="products-screen">
      <div className="header-image">
        <button className="back-button" onClick={() => navigate('/')}>Volver</button>
        <img src={banner} alt="Banner" className="banner-image" />
      </div>

      <div className="inventory-section">
        <div className="filter-options">
          <input type="text" placeholder="Buscar por nombre" />
          <button>Ordenar por precio</button>
        </div>

        {user?.rol === 'ADMINISTRADOR' && (
          <div className="admin-actions">
            <button
              onClick={() => {
                setSelectedProduct(null);
                setIsModalOpen(true);
              }}
              className="btn btn-primary"
            >
              Agregar Producto
            </button>
          </div>
        )}

        {error && <p className="error">{error}</p>}
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id_producto} className="product-item">
              <ProductCard product={product} addToCart={addToCart} />
              {user?.rol === 'ADMINISTRADOR' && (
                <div className="admin-buttons">
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsModalOpen(true);
                    }}
                    className="btn btn-secondary"
                  >
                    Editar
                  </button>
                  <button onClick={() => handleDeleteProduct(product.id_producto)} className="btn btn-danger">
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Carrito de Compras */}
      <Cart cart={cart} setCart={setCart} />

      {/* Modal para Crear/Editar Productos */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Formulario de Producto"
        className="modal"
        ariaHideApp={false}
      >
        <h2>{selectedProduct ? 'Editar Producto' : 'Agregar Producto'}</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const productData = {
              id_producto: selectedProduct?.id_producto ?? null,
              nombre_producto: formData.get('nombre_producto'),
              descripcion: formData.get('descripcion'),
              precio: parseFloat(formData.get('precio')),
              stock: parseInt(formData.get('stock'), 10),
            };

            if (selectedProduct) {
              if (selectedProduct.id_producto) {
                await handleUpdateProduct(selectedProduct.id_producto, productData);
              } else {
                console.error("ID del producto seleccionado no encontrado.");
              }
            } else {
              await handleCreateProduct(productData);
            }
          }}
        >
          <input
            name="nombre_producto"
            placeholder="Nombre del producto"
            defaultValue={selectedProduct?.nombre_producto || ''}
            required
          />
          <textarea
            name="descripcion"
            placeholder="Descripción"
            defaultValue={selectedProduct?.descripcion || ''}
          />
          <input
            name="precio"
            type="number"
            step="0.01"
            placeholder="Precio"
            defaultValue={selectedProduct?.precio || ''}
            required
          />
          <input
            name="stock"
            type="number"
            placeholder="Stock"
            defaultValue={selectedProduct?.stock || ''}
            required
          />
          <button type="submit" className="btn btn-primary">
            {selectedProduct ? 'Actualizar' : 'Crear'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ProductsScreen;