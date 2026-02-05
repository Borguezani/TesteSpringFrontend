import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { getClientes, deleteCliente } from '../lib/api';
import type { Cliente } from '../types/cliente';
import { enqueueSnackbar } from 'notistack';
import Layout from '../components/Layout';

export default function Clientes() {
    const navigate = useNavigate();
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);

    const loadClientes = async () => {
        try {
            const data = await getClientes();
            setClientes(data);
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            enqueueSnackbar('Erro ao carregar clientes', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadClientes();
    }, []);

    const handleEdit = (id: number) => {
        navigate(`/clientes/edit/${id}`);
    };

    const handleDeleteClick = (cliente: Cliente) => {
        setClienteToDelete(cliente);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (clienteToDelete?.id) {
            try {
                await deleteCliente(clienteToDelete.id);
                enqueueSnackbar('Cliente excluído com sucesso!', { variant: 'success' });
                loadClientes();
            } catch (error) {
                console.error('Erro ao excluir cliente:', error);
                enqueueSnackbar('Erro ao excluir cliente', { variant: 'error' });
            }
        }
        setDeleteDialogOpen(false);
        setClienteToDelete(null);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setClienteToDelete(null);
    };

    return (
        <Layout>
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Clientes
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/clientes/new')}
                    >
                        Novo Cliente
                    </Button>
                </Box>

                {loading ? (
                    <Typography>Carregando...</Typography>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Nome</TableCell>
                                    <TableCell>CPF</TableCell>
                                    <TableCell>Cidade</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {clientes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            Nenhum cliente cadastrado
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    clientes.map((cliente) => (
                                        <TableRow key={cliente.id}>
                                            <TableCell>{cliente.id}</TableCell>
                                            <TableCell>{cliente.nome}</TableCell>
                                            <TableCell>{cliente.cpf}</TableCell>
                                            <TableCell>{cliente.cidade}</TableCell>
                                            <TableCell>{cliente.estado}</TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleEdit(cliente.id!)}
                                                    size="small"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleDeleteClick(cliente)}
                                                    size="small"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                    <DialogTitle>Confirmar Exclusão</DialogTitle>
                    <DialogContent>
                        Tem certeza que deseja excluir o cliente {clienteToDelete?.nome}?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteCancel}>Cancelar</Button>
                        <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                            Excluir
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Layout>
    );
}
