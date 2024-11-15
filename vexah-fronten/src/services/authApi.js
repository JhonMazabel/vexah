// src/services/authApi.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth'; // Asegúrate de que este sea el mismo URL que tu backend

// Función para el registro de usuario
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Función para el inicio de sesión
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
