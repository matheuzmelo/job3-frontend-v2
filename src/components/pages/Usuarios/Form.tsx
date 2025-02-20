import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Container, Grid, TextField, Typography } from '@mui/material';
import { SaveAltRounded } from '@mui/icons-material';
import { useUserContext } from '../../../context/usuario.context';
import { UsuariosService } from '../../../services/api/Usuarios/usuarios.service';

export const UserForm: React.FC = () => {
    const { currentUser, setCurrentUser, setUsers, addUser, users } = useUserContext();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        usuario: '',
        tenant_id: '',
        email: '',
        senha: '',
        nivel: 0,
    });

    const fetchUsuarios = async () => {
        const response = await UsuariosService.getAll();
        setUsers(response.data);
    }

    useEffect(() => {
        if (currentUser) {
            setFormData({
                nome: currentUser.nome,
                usuario: currentUser.usuario,
                tenant_id: currentUser.tenant_id,
                email: currentUser.email,
                senha: currentUser.senha,
                nivel: currentUser.nivel,
            });
        } else {
            setFormData({
                nome: '',
                usuario: '',
                tenant_id: '',
                email: '',
                senha: '',
                nivel: 0,
            });
        }
    }, [currentUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        setIsLoading(false);
    };

    const handleClear = () => {
        setFormData({
            nome: '',
            usuario: '',
            tenant_id: '',
            email: '',
            senha: '',
            nivel: 0,
        });
    };

    return (
        <Container maxWidth="xl">
            <Typography variant="h5" sx={{ mb: 2 }}>Cadastro de Usuário</Typography>
            <Grid container spacing={2}>
                {/* Campos do Formulário */}
                <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Nome" name="nome" value={formData.nome} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Usuário" name="usuario" value={formData.usuario} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Tenant ID" name="tenant_id" value={formData.tenant_id} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Senha" name="senha" value={formData.senha} onChange={handleChange} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField label="Nível" name="nivel" value={formData.nivel} onChange={handleChange} type="number" fullWidth />
                </Grid>
            </Grid>
            {/* Botões de Ação */}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveAltRounded />}
                    onClick={handleSubmit}
                    disabled={isLoading || !formData.nome || !formData.usuario || !formData.email}
                    sx={{ opacity: isLoading ? 0.7 : 1 }}
                >
                    {isLoading ? 'Salvando...' : 'Salvar Usuário'}
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleClear}>
                    Limpar
                </Button>
            </Box>
        </Container>
    );
};
