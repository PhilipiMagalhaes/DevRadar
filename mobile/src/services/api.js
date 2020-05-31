import axios from 'axios';

const api = axios.create({
baseURL:'<Your backend address>',    
});

export default api;