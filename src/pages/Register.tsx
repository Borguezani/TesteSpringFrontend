import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Link,
} from '@mui/material';
import { register } from '../lib/auth';
import { enqueueSnackbar } from 'notistack';

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        confirmaSenha: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.senha !== formData.confirmaSenha) {
            enqueueSnackbar('As senhas não coincidem!', { variant: 'error' });
            return;
        }

        setLoading(true);

        try {
            const response = await register(formData);
            localStorage.setItem('token', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            localStorage.setItem('userEmail', response.email);
            localStorage.setItem('userName', response.nome);
            
            enqueueSnackbar('Registro realizado com sucesso!', { variant: 'success' });
            navigate('/clientes');
        } catch (error) {
            console.error('Erro no registro:', error);
            enqueueSnackbar('Erro ao fazer registro. Tente novamente.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Criar Conta
                    </Typography>
                    <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
                        Preencha os dados abaixo
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="nome"
                            label="Nome"
                            name="nome"
                            autoComplete="name"
                            autoFocus
                            value={formData.nome}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="E-mail"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="senha"
                            label="Senha"
                            type="password"
                            id="senha"
                            autoComplete="new-password"
                            value={formData.senha}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmaSenha"
                            label="Confirmar Senha"
                            type="password"
                            id="confirmaSenha"
                            autoComplete="new-password"
                            value={formData.confirmaSenha}
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Registrando...' : 'Registrar'}
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Link
                                component="button"
                                variant="body2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/login');
                                }}
                            >
                                Já tem uma conta? Faça login
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
