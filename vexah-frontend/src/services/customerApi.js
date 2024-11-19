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


// Crear un nuevo cliente
export const registerClient = async (clientData) => {
    try {
      const response = await axios.post(`${API_URL}/`, clientData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al registrar cliente');
    }
  };
  
  // Listar todos los clientes
  export const listarClientes = async () => {
    try {
      const response = await axios.get(`${API_URL}/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al listar clientes');
    }
  };
  
  // Obtener un cliente por identificación
  export const obtenerClientePorIdentificacion = async (identificacion) => {
    try {
      const response = await axios.get(`${API_URL}/identificacion/${identificacion}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener cliente por identificación');
    }
  };
  
  // Obtener un cliente por ID
  export const obtenerClientePorId = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al obtener cliente por ID');
    }
  };
  
  // Actualizar un cliente
  export const actualizarCliente = async (id, clientData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, clientData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar cliente');
    }
  };
  
  // Eliminar un cliente (borrado lógico)
  export const eliminarCliente = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al eliminar cliente');
    }
  };
  
  // Restaurar un cliente eliminado lógicamente
  export const cambiarEstadoCliente = async (id) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al cambiar estado del cliente');
    }
  };
  