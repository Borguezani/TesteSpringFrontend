export interface Cliente {
    id?: number;
    nome: string;
    cpf: string;
    logradouro: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
}

export interface ClienteFormData {
    nome: string;
    cpf: string;
    logradouro: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
}
