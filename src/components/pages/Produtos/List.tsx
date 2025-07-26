import {
    Box,
    Button,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProdutoContext } from '../../../contexts/produtos.context';
import { ProdutosService } from '../../../services/api/Produtos/produtos.service';
import { ListLoading } from '../../organisms/ListLoading';

export const List: React.FC = () => {
    const { setProdutoAtual, setAbaAtual } = useProdutoContext();
    const [produtos, setProdutos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchProdutos = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert('Sessão expirada. Efetue o Login novamente');
            navigate(`/`);
        }

        try {
            const productList = await ProdutosService.getAll();
            if (productList) {
                setProdutos(productList.data);
            }
        } catch (error) {
            console.error('Erro ao buscar os produtos:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProdutos();
    }, []);

    const handleEdit = (produto: any) => {
        setProdutoAtual(produto);
        setAbaAtual(0); // Define a aba atual para 0 (Cadastro)
    };

    const filteredAndSortedProdutos = produtos
        .filter(produto =>
            produto.codigo.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const descA = a.codigo.toLowerCase();
            const descB = b.codigo.toLowerCase();
            return descB.localeCompare(descA);
        });

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Typography variant="h5">Lista de Produtos</Typography>
            <TextField
                label="Buscar por descrição"
                variant="outlined"
                fullWidth
                sx={{ mt: 2, mb: 2 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {!isLoading && filteredAndSortedProdutos.length == 0 && (
                <Box padding={5}>
                    <Typography variant='h5' textAlign={'center'}>Nenhuma produtos listada</Typography>
                </Box>
            )}

            {isLoading ? (
                <ListLoading />
            ) : (
                filteredAndSortedProdutos.length > 0 && (
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Código</TableCell>
                                    <TableCell>Descrição</TableCell>
                                    <TableCell>Valor Unidade</TableCell>
                                    <TableCell>Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredAndSortedProdutos.map((produto) => (
                                    <TableRow key={produto.id}>
                                        <TableCell>{produto.codigo}</TableCell>
                                        <TableCell>{produto.descricao}</TableCell>
                                        <TableCell>{produto.valor_unidade}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleEdit(produto)}
                                            >
                                                Editar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )
            )}
        </Container>
    );
};
