import axios from 'axios';

const api = axios.create({
    baseURL: 'https://crud-production-b855.up.railway.app/api'
});

export default api;