// src/services/inventoryApi.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/inventory';

export const getTransactions = async (id_producto) => {
    const token = localStorage.getItem('token'); // Obtén el token de localStorage
    const response = await axios.get(`${API_URL}/producto/${id_producto}`, {
        headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en los encabezados
        },
    });

    return response.data;
};

export const createTransaction = async (transactionData) => {
    const token = localStorage.getItem('token'); // Obtén el token de localStorage
    const response = await axios.post(`${API_URL}`, transactionData, {
        headers: {
            Authorization: `Bearer ${token}`, // Incluye el token en los encabezados
        },
    });
    
    return response.data;
};
