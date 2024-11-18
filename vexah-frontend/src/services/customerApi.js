// src/services/customerApi.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/customers';

// Función para buscar cliente por identificación
export const getCustomerByIdentification = async (identificacion) => {
    try {
        const response = await axios.get(`${API_URL}/identificacion/${identificacion}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al buscar cliente';
    }
};

// Función para crear un nuevo cliente
export const createCustomer = async (clienteData) => {
    try {
        const response = await axios.post(API_URL, clienteData);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al crear cliente';
    }
};