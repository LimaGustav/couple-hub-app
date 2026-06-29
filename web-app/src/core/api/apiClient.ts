import axios from 'axios';

// Instância base do Axios pré-configurada para comunicação com o Gateway / BFF (.NET 10)
const apiClient = axios.create({
  // A URL base pode ser customizada através do arquivo .env usando VITE_API_URL
  baseURL: import.meta.env.COUPLEHUB_API_URL || 'http://localhost:5070',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar o Bearer Token JWT automaticamente em todas as requisiçõestr
apiClient.interceptors.request.use(
  (config) => {
    // Busca o token do localStorage ou do sessionStorage (conforme o "Lembrar de mim")
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
