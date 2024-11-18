// src/services/authApi.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth'; // Asegúrate de que este sea el URL base de tu backend

// Función para el registro de usuario
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData); // Cambiado a /register
    return response.data; // Devuelve los datos de la respuesta
  } catch (error) {
    throw error.response?.data || 'Error en la conexión al servidor'; // Manejo mejorado de errores
  }
};

// Función para el inicio de sesión
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data; // Devuelve los datos, incluyendo el token si se recibe
  } catch (error) {
    throw error.response?.data || 'Error en la conexión al servidor'; // Manejo mejorado de errores
  }
};
