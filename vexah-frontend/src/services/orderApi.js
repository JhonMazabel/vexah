import axios from 'axios';

const API_URL = 'http://localhost:3000/api/orders'; // Cambia esto según tu configuración de backend

// Función para crear una orden
export const createOrder = async (orderData) => {
    try {
        const token = localStorage.getItem('token'); // Obtén el token de localStorage
        const response = await axios.post(API_URL, orderData, {
            headers: {
                Authorization: `Bearer ${token}`, // Incluye el token en los encabezados
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al crear la orden';
    }
};

// Función para listar órdenes
export const getOrders = async () => {
    try {
        const token = localStorage.getItem('token'); // Obtén el token de localStorage
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`, // Incluye el token en los encabezados
            },
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al listar las órdenes';
    }
};

// Función para descargar la factura de la orden en PDF
export const downloadOrderPDF = async (orderId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/${orderId}/imprimir`, {
            headers: {
                Authorization: `Bearer ${token}`, // Incluye el token en los encabezados
            },
            responseType: 'blob', // Esto es importante para manejar archivos binarios
        });

        // Crear un objeto URL para el archivo descargado
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'factura.pdf'); // Nombre del archivo
        document.body.appendChild(link);
        link.click(); // Disparar el clic para iniciar la descarga

        // Eliminar el objeto URL después de la descarga
        window.URL.revokeObjectURL(url);
    } catch (error) {
        throw error.response?.data || 'Error al descargar la factura';
    }
};
