import React from 'react';
import { Box, Button, CircularProgress, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import {  useUserContext } from '../../../context/usuario.context';

export const UserList: React.FC = () => {
    const { users, setCurrentUser } = useUserContext();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleEdit = (user: any) => {
        setCurrentUser(user);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Typography variant="h5">Lista de Usuários</Typography>
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Usuário</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Nível</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.nome}</TableCell>
                                    <TableCell>{user.usuario}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.nivel}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => handleEdit(user)}>
                                            Editar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};
