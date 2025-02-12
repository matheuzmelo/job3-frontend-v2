import { AddShoppingCartRounded, ClearRounded, DeleteRounded, SaveAltRounded } from '@mui/icons-material';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import {
    Box,
    Button,
    Container,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import ToastMessage from '../../organisms/ToastMessage';

interface ProdutoSelecionado {
    produto: string;
    valor: number;
    unidade: string;
    quantidade: number;
}

// Lista de empresas fictícias
// const empresas = [
//     { id: 1, nome: 'Empresa A' },
//     { id: 2, nome: 'Empresa B' },
//     { id: 3, nome: 'Empresa C' },
// ];

// Lista de clientes vinculados a empresas
// const clientesPorEmpresa = {
//     1: ['Cliente A1', 'Cliente A2', 'Cliente A3'],
//     2: ['Cliente B1', 'Cliente B2'],
//     3: ['Cliente C1', 'Cliente C2', 'Cliente C3', 'Cliente C4'],
// };

// Lista de produtos com preços
const produtosComPrecos = [
    { id: 1, nome: 'Produto 1', preco: 100.00 },
    { id: 2, nome: 'Produto 2', preco: 200.00 },
    { id: 3, nome: 'Produto 3', preco: 150.00 },
];

export const Form = () => {
    const [dataPrevisao, setDataPrevisao] = useState(dayjs());
    const [empresaId] = useState('');
    const [cliente, setCliente] = useState('');
    const [produtoId, setProdutoId] = useState('');
    const [valor, setValor] = useState('');
    const [unidade, setUnidade] = useState('');
    const [quantidade, setQuantidade] = useState<number>(1);
    const [produtosDaProposta, setProdutosDaProposta] = useState<ProdutoSelecionado[]>([]);
    const [clientes] = useState<string[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [openToast, setOpenToast] = useState(false);
    const [toastStatus, setToastStatus] = useState<'success' | 'alert' | 'warn'>('success');
    const [message, setMessage] = useState('Operação realizada com sucesso!');

    const handleOpenToast = (status: 'success' | 'alert' | 'warn', msg: string) => {
        setToastStatus(status);
        setMessage(msg);
        setOpenToast(true);
    };

    const handleCloseToast = () => {
        setOpenToast(false);
    };

    useEffect(() => {
        const produtosSalvos = localStorage.getItem('produtosDaProposta');
        if (produtosSalvos) {
            setProdutosDaProposta(JSON.parse(produtosSalvos));
        }
    }, []);

    // const handleEmpresaChange = (event: any) => {
    //     const selectedEmpresaId = event.target.value;
    //     setEmpresaId(selectedEmpresaId);
    //     setClientes(clientesPorEmpresa[selectedEmpresaId] || []);
    //     setCliente('');
    // };

    const handleAddProduct = () => {
        const produtoSelecionado = produtosComPrecos.find(produto => produto.id === parseInt(produtoId));
        if (produtoSelecionado && unidade) {
            const novoProduto: ProdutoSelecionado = {
                produto: produtoSelecionado.nome,
                valor: produtoSelecionado.preco,
                unidade,
                quantidade
            };

            if (editIndex !== null) {
                const produtosAtualizados = [...produtosDaProposta];
                produtosAtualizados[editIndex] = novoProduto;
                setProdutosDaProposta(produtosAtualizados);
                setEditIndex(null);
                localStorage.setItem('produtosDaProposta', JSON.stringify(produtosAtualizados));
            } else {
                setProdutosDaProposta([...produtosDaProposta, novoProduto]);
                localStorage.setItem('produtosDaProposta', JSON.stringify([...produtosDaProposta, novoProduto]));
            }

            setProdutoId('');
            setValor('');
            setUnidade('');
            setQuantidade(1);
        }
    };

    const handleEditProduct = (index: number) => {
        const produto = produtosDaProposta[index];
        setProdutoId(produtosComPrecos.find(p => p.nome === produto.produto)?.id.toString() || '');
        setValor(produto.valor.toString());
        setUnidade(produto.unidade);
        setQuantidade(produto.quantidade);
        setEditIndex(index);
    };

    const handleDeleteProduct = (index: number) => {
        const novosProdutos = produtosDaProposta.filter((_, i) => i !== index);
        setProdutosDaProposta(novosProdutos);
        localStorage.setItem('produtosDaProposta', JSON.stringify(novosProdutos));
    };

    const handleSave = () => {
        handleOpenToast('success', 'Proposta salva com sucesso!');

        const newProposal = {
            cliente: cliente,
            importado: quantidade,
            total: valor
        };

        const existingProposals = localStorage.getItem('propostaData');
        let proposalsArray: any[] = [];

        try {
            if (existingProposals) {
                proposalsArray = JSON.parse(existingProposals);

                if (!Array.isArray(proposalsArray)) {
                    proposalsArray = [];
                }
            }
        } catch (error) {
            console.error('Erro ao fazer parse do localStorage:', error);
            proposalsArray = [];
        }

        const isDuplicate = proposalsArray.some((proposal) => proposal.cliente === newProposal.cliente);

        if (!isDuplicate) {
            proposalsArray.push(newProposal);

            localStorage.setItem('propostaData', JSON.stringify(proposalsArray));
            handleOpenToast('success', 'Proposta salva com sucesso!');
        } else {
            handleOpenToast('warn', 'Proposta já existe para esse cliente!');
        }
    };



    const handleClear = () => {
        setProdutosDaProposta([]);
        localStorage.removeItem('produtosDaProposta');
    };

    return (
        <Container maxWidth="xl" sx={{ margin: '0 auto', padding: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                    display="flex"
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    gap={2}
                    mb={2}
                >
                    <DatePicker
                        label="Data Previsão da proposta"
                        value={dataPrevisao}
                        onChange={(newValue: any) => setDataPrevisao(newValue)}
                    // renderInput={(params: any) => <TextField fullWidth {...params} />}
                    />
                    <TextField
                        fullWidth
                        label="Tabela Preço"
                        variant="outlined"
                    />
                </Box>

                {/* Empresa e Cliente */}
                <Box
                    display="flex"
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    gap={2}
                    mb={2}
                >
                    {/* <Box flex={1}>
                        <InputLabel>Empresa</InputLabel>
                        <Select
                            fullWidth
                            variant="outlined"
                            value={empresaId}
                            onChange={handleEmpresaChange}
                        >
                            <MenuItem value="">Selecione</MenuItem>
                            {empresas.map(empresa => (
                                <MenuItem key={empresa.id} value={empresa.id}>
                                    {empresa.nome}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box> */}

                    <Box flex={1}>
                        <InputLabel>Cliente</InputLabel>
                        <Select
                            fullWidth
                            variant="outlined"
                            value={cliente}
                            onChange={(e) => setCliente(e.target.value)}
                            disabled={!empresaId} >
                            <MenuItem value="">Selecione</MenuItem>
                            {clientes.map((clienteNome, index) => (
                                <MenuItem key={index} value={clienteNome}>
                                    {clienteNome}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                </Box>
                <Box>
                    <Typography variant="h5">
                        Produto
                    </Typography>
                </Box>
                <Box
                    display="flex"
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    gap={2}
                    mb={2}
                >
                    <Box flex={1}>
                        <Select
                            fullWidth
                            variant="outlined"
                            value={produtoId}
                            onChange={(e) => {
                                const selectedProduto = produtosComPrecos.find(produto => produto.id === parseInt(e.target.value));
                                setProdutoId(e.target.value);
                                setValor(selectedProduto ? selectedProduto.preco.toString() : ''); // Define o valor do produto
                            }}
                        >
                            <MenuItem value="">Selecione</MenuItem>
                            {produtosComPrecos.map(produto => (
                                <MenuItem key={produto.id} value={produto.id}>
                                    {produto.nome}
                                </MenuItem>
                            ))}
                        </Select>
                    </Box>
                    <TextField
                        fullWidth
                        label="Valor"
                        variant="outlined"
                        type="number"
                        value={valor}
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        fullWidth
                        label="Unidade"
                        variant="outlined"
                        value={unidade}
                        onChange={(e) => setUnidade(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="Quantidade"
                        variant="outlined"
                        type="number"
                        value={quantidade}
                        onChange={(e) => setQuantidade(parseInt(e.target.value))}
                    />
                    <Button variant="contained" color="primary" onClick={handleAddProduct} sx={{
                        color: "white"
                    }}>
                        {editIndex !== null ? <SaveAltRounded /> : <AddShoppingCartRounded />}
                    </Button>
                </Box>



                {/* Tabela de Produtos Adicionados */}
                <Box>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Ações</TableCell>
                                    <TableCell>Produto</TableCell>
                                    <TableCell>Valor</TableCell>
                                    <TableCell>Unidade</TableCell>
                                    <TableCell>Quantidade</TableCell>
                                    <TableCell>Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {produtosDaProposta.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            Nenhum produto adicionado.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    produtosDaProposta.map((produto, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Button
                                                    color="primary"
                                                    onClick={() => handleEditProduct(index)}
                                                >
                                                    <EditNoteRoundedIcon />
                                                </Button>
                                                <Button
                                                    color="secondary"
                                                    onClick={() => handleDeleteProduct(index)}
                                                >
                                                    <DeleteRounded />
                                                </Button>
                                            </TableCell>
                                            <TableCell>{produto.produto}</TableCell>
                                            <TableCell>{produto.valor}</TableCell>
                                            <TableCell>{produto.unidade}</TableCell>
                                            <TableCell>{produto.quantidade}</TableCell>
                                            <TableCell>
                                                {(produto.valor * produto.quantidade).toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Box mt={2} display="flex" gap={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<SaveAltRounded />}
                        onClick={handleSave}
                        sx={{ color: '#fff' }}
                    >
                        Salvar
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<ClearRounded />}
                        onClick={handleClear}
                    >
                        Limpar
                    </Button>
                </Box>
                <ToastMessage
                    status={toastStatus}
                    message={message}
                    open={openToast}
                    onClose={handleCloseToast}
                />
            </LocalizationProvider>
        </Container>
    );
};