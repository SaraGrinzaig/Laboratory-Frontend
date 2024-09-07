//put here all the call servers
import axios from 'axios';
const API_URL = 'https://localhost:5000/api';

export const deleteRequest = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/Device`);
        return response.status === 200;
    } catch (error) {
        console.error('Error deleting request:', error);
        throw error;
    }
};