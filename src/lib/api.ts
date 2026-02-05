import type { Cep } from "../types/cep";
import type { Cliente, ClienteFormData } from "../types/cliente";
import axiosInstance from "./axios";

// API de Clientes
export const getClientes = async (): Promise<Cliente[]> => {
    const response = await axiosInstance.get('/clientes');
    return response.data;
};

export const getClienteById = async (id: number): Promise<Cliente> => {
    const response = await axiosInstance.get(`/clientes/${id}`);
    return response.data;
};

export const createCliente = async (data: ClienteFormData): Promise<Cliente> => {
    const response = await axiosInstance.post('/clientes', data);
    return response.data;
};

export const updateCliente = async (id: number, data: ClienteFormData): Promise<Cliente> => {
    const response = await axiosInstance.put(`/clientes/${id}`, data);
    return response.data;
};

export const deleteCliente = async (id: number): Promise<void> => {
    await axiosInstance.delete(`/clientes/${id}`);
};

// API de CEP
export const buscarCep = async (cep: string): Promise<Cep> => {
    const response = await axiosInstance.get(`/cep/${cep}`);
    return response.data;
};
