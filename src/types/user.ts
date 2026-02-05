export interface RegisterData {
    nome: string;
    email: string;
    senha: string;
    confirmaSenha: string;
}

export interface LoginData {
    email: string;
    senha: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tipo: string;
    email: string;
    nome: string;
}