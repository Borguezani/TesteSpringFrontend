import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Grid,
} from '@mui/material';
import { createCliente, updateCliente, getClienteById } from '../lib/api';
import type { ClienteFormData } from '../types/cliente';
import { enqueueSnackbar } from 'notistack';
import Layout from '../components/Layout';
import axios from 'axios';

export default function ClienteForm() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState<ClienteFormData>({
        nome: '',
        cpf: '',
        logradouro: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
    });
    const [loading, setLoading] = useState(false);
    const [loadingCep, setLoadingCep] = useState(false);

    const loadCliente = useCallback(async (clienteId: number) => {
        try {
            const data = await getClienteById(clienteId);
            setFormData(data);
        } catch (error) {
            console.error('Erro ao carregar cliente:', error);
            enqueueSnackbar('Erro ao carregar cliente', { variant: 'error' });
            navigate('/clientes');
        }
    }, [navigate]);

    useEffect(() => {
        if (isEdit && id) {
            loadCliente(Number(id));
        }
    }, [id, isEdit, loadCliente]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const formatCPF = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length <= 11) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        return value;
    };

    const formatCEP = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length <= 8) {
            return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
        }
        return value;
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCPF(e.target.value);
        setFormData({
            ...formData,
            cpf: formatted,
        });
    };

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCEP(e.target.value);
        setFormData({
            ...formData,
            cep: formatted,
        });
    };

    const buscarCep = async () => {
        const cepLimpo = formData.cep.replace(/\D/g, '');
        
        if (cepLimpo.length !== 8) {
            enqueueSnackbar('CEP inválido', { variant: 'error' });
            return;
        }

        setLoadingCep(true);
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            const data = response.data;

            if (data.erro) {
                enqueueSnackbar('CEP não encontrado', { variant: 'error' });
                return;
            }

            setFormData({
                ...formData,
                logradouro: data.logradouro || '',
                bairro: data.bairro || '',
                cidade: data.localidade || '',
                estado: data.uf || '',
            });
            enqueueSnackbar('CEP encontrado!', { variant: 'success' });
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            enqueueSnackbar('Erro ao buscar CEP', { variant: 'error' });
        } finally {
            setLoadingCep(false);
        }
    };

    const handleCepBlur = () => {
        if (formData.cep.replace(/\D/g, '').length === 8) {
            buscarCep();
        }
    };

    const validateCPF = (cpf: string): boolean => {
        const cleaned = cpf.replace(/\D/g, '');
        
        if (cleaned.length !== 11) return false;
        if (/^(\d)\1{10}$/.test(cleaned)) return false;

        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cleaned.charAt(i)) * (10 - i);
        }
        let digit = 11 - (sum % 11);
        if (digit >= 10) digit = 0;
        if (digit !== parseInt(cleaned.charAt(9))) return false;

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cleaned.charAt(i)) * (11 - i);
        }
        digit = 11 - (sum % 11);
        if (digit >= 10) digit = 0;
        if (digit !== parseInt(cleaned.charAt(10))) return false;

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateCPF(formData.cpf)) {
            enqueueSnackbar('CPF inválido', { variant: 'error' });
            return;
        }

        setLoading(true);

        try {
            const dataToSend = {
                ...formData
            };

            if (isEdit && id) {
                await updateCliente(Number(id), dataToSend);
                enqueueSnackbar('Cliente atualizado com sucesso!', { variant: 'success' });
            } else {
                await createCliente(dataToSend);
                enqueueSnackbar('Cliente criado com sucesso!', { variant: 'success' });
            }
            navigate('/clientes');
        } catch (error) {
            console.error('Erro ao salvar cliente:', error);
            enqueueSnackbar('Erro ao salvar cliente', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                    {isEdit ? 'Editar Cliente' : 'Novo Cliente'}
                </Typography>

                <Paper sx={{ p: 3, mt: 3 }}>
                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Nome"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="CPF"
                                    name="cpf"
                                    value={formData.cpf}
                                    onChange={handleCpfChange}
                                    inputProps={{ maxLength: 14 }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="CEP"
                                    name="cep"
                                    value={formData.cep}
                                    onChange={handleCepChange}
                                    onBlur={handleCepBlur}
                                    inputProps={{ maxLength: 9 }}
                                    helperText="Digite o CEP e pressione Tab para buscar"
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Logradouro"
                                    name="logradouro"
                                    value={formData.logradouro}
                                    onChange={handleChange}
                                    disabled={loadingCep}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Bairro"
                                    name="bairro"
                                    value={formData.bairro}
                                    onChange={handleChange}
                                    disabled={loadingCep}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Cidade"
                                    name="cidade"
                                    value={formData.cidade}
                                    onChange={handleChange}
                                    disabled={loadingCep}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 2 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Estado"
                                    name="estado"
                                    value={formData.estado}
                                    onChange={handleChange}
                                    inputProps={{ maxLength: 2 }}
                                    disabled={loadingCep}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => navigate('/clientes')}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={loading || loadingCep}
                                    >
                                        {loading ? 'Salvando...' : 'Salvar'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
        </Layout>
    );
}
