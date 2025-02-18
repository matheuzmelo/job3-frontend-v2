import {
    Button,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    CircularProgress,
    Box
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNfeContext } from '../../../context/nfe.context';
import { NotasFicaisService } from '../../../services/api/NotasFiscais/nfe.service';

// Dados mockados consistentes com o formulário
const clientesPorEmpresa = {
    1: [
        { id: 1, nome: 'Cliente A1' },
        { id: 2, nome: 'Cliente A2' },
    ],
    2: [
        { id: 3, nome: 'Cliente B1' },
        { id: 4, nome: 'Cliente B2' },
    ],
    3: [
        { id: 5, nome: 'Cliente C1' },
        { id: 6, nome: 'Cliente C2' },
    ],
};

export const List: React.FC = () => {
    const { setNfeAtual, setAbaAtual }: any = useNfeContext();
    const [notas, setNotas] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isEmpty, setIsEmpty] = useState<boolean>(false);

    const carregarNotas = async () => {
        setLoading(true);
        try {
            const dadosSalvos = await NotasFicaisService.getAll();
            if (dadosSalvos.data) {
                setNotas(dadosSalvos.data);
                setIsEmpty(dadosSalvos.data.length === 0);
            } else {
                setIsEmpty(true);
            }
        } catch (error) {
            console.error(error);
            setIsEmpty(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarNotas();
    }, []);

    const getNomeCliente = (pessoaId: number) => {
        for (const clientes of Object.values(clientesPorEmpresa)) {
            const cliente = clientes.find(c => c.id === pessoaId);
            if (cliente) return cliente.nome;
        }
        return 'Cliente não encontrado';
    };

    // const calcularTotal = (produtos) => {
    //     return produtos.reduce((total, produto) =>
    //         total + (produto.quantidade * produto.valor_unitario), 0
    //     ).toFixed(2);
    // };

    const handleEdit = (nota) => {
        setNfeAtual({
            ...nota
        });
        setAbaAtual(0);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
                Lista de Notas Fiscais Eletrônicas
            </Typography>

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                    <CircularProgress />
                </Box>
            ) : isEmpty ? (
                <Typography variant="body1" align="center" sx={{ mt: 4 }}>
                    Nenhuma nota fiscal encontrada.
                </Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Número</TableCell>
                                <TableCell>Cliente</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {notas.map((nota, index) => (
                                <TableRow key={index}>
                                    <TableCell>{nota.numero}</TableCell>
                                    <TableCell>{nota.pessoa.primeiro_nome } {nota.pessoa.segundo_nome}</TableCell>
                                    <TableCell>R$ {nota.total_notal_fiscal}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => handleEdit(nota.numero)}
                                        >
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