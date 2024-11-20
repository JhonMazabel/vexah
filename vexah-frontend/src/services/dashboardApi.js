import axios from 'axios';

const API_URL = 'http://localhost:3000/api/dashboard'; 

export const getStats = async () => {
    try {
        const response = await axios.get(`${API_URL}/stats`);
        return response.data;
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
};

// setStats(response.data.data);
// finally {
//     setLoading(false);
// }