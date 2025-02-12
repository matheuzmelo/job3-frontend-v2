import {
    Container,
    Grid,
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField
} from '@mui/material';
import React, { useEffect, useState } from 'react';

interface Proposta {
    cliente: string,
    importado: string,
    total: number
}

type Order = 'asc' | 'desc';

export const List: React.FC = () => {
    const [proposta, setProposta] = useState<Proposta[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [orderBy, setOrderBy] = useState<keyof Proposta>('cliente');
    const [order, setOrder] = useState<Order>('asc');

    useEffect(() => {
        const getLocalProposal = localStorage.getItem('propostaData');
        if (getLocalProposal) {
            setProposta(JSON.parse(getLocalProposal) as Proposta[]);
        }
    }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleRequestSort = (property: keyof Proposta) => {
        const isAscending = orderBy === property && order === 'asc';
        setOrder(isAscending ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const filteredPropostas = proposta.filter(proposta =>
        proposta.cliente.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedPropostas = filteredPropostas.sort((a, b) => {
        if (a[orderBy] < b[orderBy]) {
            return order === 'asc' ? -1 : 1;
        }
        if (a[orderBy] > b[orderBy]) {
            return order === 'asc' ? 1 : -1;
        }
        return 0;
    });

    return (
        <Container maxWidth="xl" sx={{ display: 'grid', gap: 3 }}>
            <Grid item xs={12}>
                <TextField
                    label="Buscar Cliente"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </Grid>
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell onClick={() => handleRequestSort('cliente')} style={{ cursor: 'pointer' }}>
                                    Cliente
                                </TableCell>
                                <TableCell onClick={() => handleRequestSort('importado')} style={{ cursor: 'pointer' }}>
                                    Importado
                                </TableCell>
                                <TableCell onClick={() => handleRequestSort('total')} style={{ cursor: 'pointer' }}>
                                    Total
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {sortedPropostas && sortedPropostas.map((produto, index) => (
                                <TableRow key={index}>
                                    <TableCell>{produto.cliente}</TableCell>
                                    <TableCell>{produto.importado}</TableCell>
                                    <TableCell>{produto.total}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Container>
    );
};
