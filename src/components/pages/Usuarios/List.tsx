import React from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Pagination,
    TextField
} from '@mui/material';
import { useUserContext } from '../../../context/usuario.context';

interface UserListProps {
    setAbaAtual: (value: number) => void; // Prop para mudar a aba ativa
}

export const UserList: React.FC<UserListProps> = ({ setAbaAtual }) => {
    const { users, setCurrentUser } = useUserContext();
    const [isLoading, setIsLoading] = React.useState(false);
    const [page, setPage] = React.useState(1);
    const [searchTerm, setSearchTerm] = React.useState('');
    const itemsPerPage = 15;

    const handleEdit = (user: any) => {
        setCurrentUser(user); // Define o usuário atual no contexto
        setAbaAtual(0); // Muda para a aba do formulário (aba 0)
    };

    const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        setPage(1); // Resetar para a primeira página ao buscar
    };

    // Filtrar usuários com base no termo de busca
    const filteredUsers = users.filter((user) => {
        return (
            user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.usuario.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Calcular os usuários que devem ser exibidos na página atual
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Typography variant="h5">Lista de Usuários</Typography>
            <Box sx={{ mt: 2, mb: 2 }}>
                <TextField
                    label="Buscar por nome, email ou usuário"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </Box>
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <TableContainer component={Paper}>
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
                                {currentUsers.map((user) => (
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
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Pagination
                            count={Math.ceil(filteredUsers.length / itemsPerPage)}
                            page={page}
                            onChange={handleChangePage}
                            color="primary"
                        />
                    </Box>
                </>
            )}
        </Container>
    );
};