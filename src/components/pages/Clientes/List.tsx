import {
    Button,
    Container,
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography
} from '@mui/material';
import React from 'react';
import { Cliente, useClienteContext } from '../../../contexts/clientes.context';

export const List: React.FC = () => {
    const { setClienteAtual, setAbaAtual } = useClienteContext();

    const clientes: Cliente[] = [
        // Dados fictícios
        {
            id: 1,
            name: 'João Silva',
            fantasia: 'Fantasia A',
            address: 'Rua A',
            neighborhood: 'Bairro A',
            city: 'Cidade A',
            state: 'SP',
            zip: '12345-678',
            email: 'joao@gmail.com',
            ieRg: '123456789',
            cpfCnpj: '123.456.789-00',
            phone: '(11) 99999-9999',
            types: ['Cliente'],
        },
    ];

    const handleEdit = (cliente: Cliente) => {
        setClienteAtual(cliente);
        setAbaAtual(0);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, display: 'grid' }}>
            <Typography variant="h5">Lista de Clientes</Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Fantasia</TableCell>
                            <TableCell>CNPJ/CPF</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clientes.map((cliente) => (
                            <TableRow key={cliente.id}>
                                <TableCell>{cliente.name}</TableCell>
                                <TableCell>{cliente.fantasia}</TableCell>
                                <TableCell>{cliente.cpfCnpj}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleEdit(cliente)}
                                    >
                                        Editar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};