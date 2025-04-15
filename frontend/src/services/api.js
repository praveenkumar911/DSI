import axios from 'axios';

// Create an Axios instance
const BASE_URL = 'http://localhost:5001/api';
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
 
export default apiClient;
 