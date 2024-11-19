// src/screens/ProductsScreen.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard/ProductCard';
import Cart from '../components/Cart/Cart';
import '../scss/ProductModal.scss';
import { getActiveProducts, createProduct, deleteProduct, updateProduct } from '../services/productApi';
import { AuthContext } from '../context/AuthContext';
import banner from '../assets/banner.png';
import Modal from 'react-modal';
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

  // Obtener los productos activos
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

  // Añadir al carrito
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

  // Crear nuevo producto (administrador)
  const handleCreateProduct = async (productData) => {
    try {
      await createProduct(productData, token);
      setRefresh(!refresh);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error al crear producto:', err);
    }
  };

  // Actualizar un producto (administrador)
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

  // Eliminar un producto (administrador)
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
      <Cart cart={cart} setCart={setCart} setRefresh={setRefresh} />

      {/* Modal para Crear/Editar Productos */}
      <Modal
  isOpen={isModalOpen}
  onRequestClose={() => setIsModalOpen(false)}
  contentLabel="Formulario de Producto"
  className="modal"
  ariaHideApp={false}
>
  <div className="modal-content">
    <h2>{selectedProduct ? 'Editar Producto' : 'Agregar Producto'}</h2>
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target); // FormData para manejar archivos
        const productData = {
          id_producto: selectedProduct?.id_producto ?? null,
          nombre_producto: formData.get('nombre_producto'),
          descripcion: formData.get('descripcion'),
          precio: parseFloat(formData.get('precio')),
          stock: parseInt(formData.get('stock'), 10),
          imagen_portada: formData.get('imagen_portada'), // Campo de imagen
        };

        if (selectedProduct) {
          await handleUpdateProduct(selectedProduct.id_producto, productData);
        } else {
          await handleCreateProduct(productData);
        }
      }}
    >
      <div>
        <label htmlFor="nombre_producto">Nombre del producto</label>
        <input
          id="nombre_producto"
          name="nombre_producto"
          defaultValue={selectedProduct?.nombre_producto || ''}
          required
        />
      </div>
      <div>
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          defaultValue={selectedProduct?.descripcion || ''}
        />
      </div>
      <div>
        <label htmlFor="precio">Precio</label>
        <input
          id="precio"
          name="precio"
          type="number"
          step="0.01"
          defaultValue={selectedProduct?.precio || ''}
          required
        />
      </div>
      <div>
        <label htmlFor="stock">Stock</label>
        <input
          id="stock"
          name="stock"
          type="number"
          defaultValue={selectedProduct?.stock || ''}
          required
        />
      </div>
      <div>
        <label htmlFor="imagen_portada">Imagen del producto</label>
        <input
          id="imagen_portada"
          name="imagen_portada"
          type="file"
          accept="image/*"
        />
      </div>
      <div className="modal-actions">
        <button type="submit" className="btn btn-primary">
          {selectedProduct ? 'Actualizar' : 'Crear'}
        </button>
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="btn btn-secondary"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</Modal>


    </div>
  );
};

export default ProductsScreen;