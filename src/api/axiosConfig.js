import axios from 'axios';

// Define a URL base para todas as requisições da API
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

export default axios;
