import axios from 'axios';

const api = axios.create({
    baseURL: 'https://pfv4sj6v-5000.use2.devtunnels.ms/api'
});

export default api;