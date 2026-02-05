
import type { AuthResponse, LoginData, RegisterData } from "../types/user";
import axiosInstance from "./axios";

export const isAuth = (): boolean => {
    return Boolean(localStorage.getItem('token'));
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/register', {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        confirmaSenha: data.confirmaSenha,
    }, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const logout = async () => {
    const response = await axiosInstance.post(`/auth/logout?refreshToken=${localStorage.getItem('refreshToken')}`);
    return response;
};