import {
    Box,
    Button,
    CircularProgress,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField // Adicionei o componente TextField
    ,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProdutoContext } from '../../../context/produtos.context';
import { ProdutosService } from '../../../services/api/Produtos/produtos.service';

export const List: React.FC = () => {
    const { setProdutoAtual, setAbaAtual } = useProdutoContext();
    const [produtos, setProdutos] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); // Estado para o termo de busca
    const navigate = useNavigate();

    const fetchProdutos = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert('Sessão expirada. Efetue o Login novamente');
            navigate(`/`);
        }

        try {
            const productList = await ProdutosService.getAll('');
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
        setAbaAtual(0);
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

            {/* Campo de busca */}
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
                    <Typography variant='h5' textAlign={'center'}>Nenhuma pessoa listada</Typography>
                </Box>
            )}

            {isLoading ? (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh'
                }}>
                    <CircularProgress />
                </Box>
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