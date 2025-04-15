import axios from 'axios';

// Create an Axios instance
const BASE_URL = 'https://pl-api.iiit.ac.in/rcts/dsi-demo1/api';
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
 
export default apiClient;
 