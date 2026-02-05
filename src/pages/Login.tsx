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
import { login } from '../lib/auth';
import { enqueueSnackbar } from 'notistack';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        senha: '',
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
        setLoading(true);

        try {
            const response = await login(formData);
            localStorage.setItem('token', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            localStorage.setItem('userEmail', response.email);
            localStorage.setItem('userName', response.nome);
            
            enqueueSnackbar('Login realizado com sucesso!', { variant: 'success' });
            navigate('/clientes');
        } catch (error) {
            console.error('Erro no login:', error);
            enqueueSnackbar('Erro ao fazer login. Verifique suas credenciais.', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%'
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Sistema de Clientes
                    </Typography>
                    <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
                        Faça login para continuar
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="E-mail"
                            name="email"
                            autoComplete="email"
                            autoFocus
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
                            autoComplete="current-password"
                            value={formData.senha}
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Link
                                component="button"
                                variant="body2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/register');
                                }}
                            >
                                Não tem uma conta? Registre-se
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
