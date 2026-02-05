import axios from 'axios';
import { enqueueSnackbar } from 'notistack';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
  (response) => response, 
  (error) => {
    if(error.response?.data?.mensagem){
        enqueueSnackbar(error.response.data.mensagem, { variant: 'error' });
    }
    if (error.response?.data.mensagem === 'Unauthenticated.') {
        enqueueSnackbar('Sessão expirada. Por favor, faça login novamente.', { variant: 'error' });
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
    }
    if (error.response?.data.campos) {
        const campos = error.response.data.campos;
        Object.keys(campos).forEach((campo) => {
            const mensagens = campos[campo];
            if (Array.isArray(mensagens)) {
            mensagens.forEach((mensagem: string) => {
                enqueueSnackbar(mensagem, { variant: 'error' });
            });
            } else if (typeof mensagens === 'string') {
            enqueueSnackbar(mensagens, { variant: 'error' });
            }
        });
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;