import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logout } from '../lib/auth';
import { enqueueSnackbar } from 'notistack';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await logout();
            if (response.status === 200) {
                localStorage.clear();
                window.location.href = '/';
            }
            enqueueSnackbar('Logout realizado com sucesso!', { variant: 'success' });
            navigate('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Sistema de Clientes
                    </Typography>
                    <Button color="inherit" onClick={() => navigate('/clientes')}>
                        Clientes
                    </Button>
                    <Button color="inherit" onClick={handleLogout}>
                        Sair
                    </Button>
                </Toolbar>
            </AppBar>
            <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
                {children}
            </Container>
        </Box>
    );
}
