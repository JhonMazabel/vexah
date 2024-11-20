import axios from 'axios';

const API_URL = 'http://localhost:3000/api/products'; // Cambia esto según la configuración de tu backend

// Función para obtener productos activos
export const getActiveProducts = async () => {
  try {
    const token = localStorage.getItem('token'); // Obtén el token de localStorage
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, // Incluye el token en los encabezados
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error al obtener productos';
  }
};

// Función para crear un producto
export const createProduct = async (productData, token) => {
  try {
    const token = localStorage.getItem('token'); // Obtén el token de localStorage
    const response = await axios.post(API_URL, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', // Si envías una imagen
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error al crear producto';
  }
};

// Función para eliminar un producto
export const deleteProduct = async (id, token) => {
  try {
    const token = localStorage.getItem('token'); // Obtén el token de localStorage
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error al eliminar producto';
  }
};

// Función para actualizar un producto
export const updateProduct = async (productId, productData, token) => {
  try {
    const token = localStorage.getItem('token'); // Obtén el token de localStorage
    const response = await axios.put(`${API_URL}/${productId}`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || 'Error al actualizar producto';
  }
};

export const getProductById = async (id_producto) => {
  const token = localStorage.getItem('token'); // Obtén el token de localStorage
  const response = await axios.get(`${API_URL}/${id_producto}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
