import axios from 'axios';

const api = axios.create({
    baseURL: 'https://rf4377l3-5000.use2.devtunnels.ms/api'
});

export default api;