import {
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useProdutoContext } from '../../../contexts/produtos.context';
import { ProdutosService } from '../../../services/api/Produtos/produtos.service';
import ToastMessage from '../../organisms/ToastMessage';
import { SaveAltRounded } from '@mui/icons-material';

export const Form: React.FC = () => {
    const { produtoAtual, setProdutoAtual }: any = useProdutoContext();
    const [openToast, setOpenToast] = useState(false);
    const [toastStatus, setToastStatus] = useState<"success" | "alert" | "warn">(
        "success"
    );
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        codigo: '',
        descricao: '',
        unidade: '',
        valor_unidade: '',
        valor_atacado: '',
        valor_revenda: '',
        valor_tabela4: '',
    });

    useEffect(() => {
        if (produtoAtual) {
            setFormData(produtoAtual);
        }
    }, [produtoAtual]);

    const handleOpenToast = (
        status: "success" | "alert" | "warn",
        msg: string
    ) => {
        setToastStatus(status);
        setMessage(msg);
        setOpenToast(true);
    };
    // Função para lidar com mudanças nos campos do formulário
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name as string]: value }));
    };

    // Função para salvar os dados do formulário
    const handleSubmit = async () => {
        setIsLoading(true); // Ativa o loading

        try {
            const productData = {
                codigo: formData.codigo,
                descricao: formData.descricao,
                unidade: formData.unidade,
                valor_unidade: Number(formData.valor_unidade),
                valor_atacado: Number(formData.valor_atacado),
                valor_revenda: Number(formData.valor_revenda),
                valor_tabela4: Number(formData.valor_tabela4),
            }
            const createData = await ProdutosService.create(productData);

            if (createData) {
                handleOpenToast("success", "Produto salvo com sucesso!");
                handleClear();
            } else {
                handleOpenToast("warn", "Erro ao salvar o produto.");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            handleOpenToast("warn", "Erro ao salvar o produto.");
        } finally {
            setIsLoading(false); // Desativa o loading
        }
    };

    // Função para limpar os campos do formulário
    const handleClear = () => {
        setFormData({
            codigo: '',
            descricao: '',
            unidade: '',
            valor_unidade: '',
            valor_atacado: '',
            valor_revenda: '',
            valor_tabela4: '',
        });
        setProdutoAtual(null);
    };

    return (
        <Container maxWidth="xl">
            <Typography variant="h5" sx={{ mb: 2 }}>
                Cadastro de Produto
            </Typography>
            <Grid container spacing={2}>
                {/* Código */}
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Código"
                        name="codigo"
                        value={formData.codigo}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

                {/* Descrição */}
                <Grid item xs={12} sm={6} md={8}>
                    <TextField
                        label="Descrição"
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

                {/* Unidade */}
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Unidade"
                        name="unidade"
                        value={formData.unidade}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

                {/* Valores */}
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Valor Unidade"
                        name="valor_unidade"
                        value={formData.valor_unidade}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Valor Atacado"
                        name="valor_atacado"
                        value={formData.valor_atacado}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Valor Revenda"
                        name="valor_revenda"
                        value={formData.valor_revenda}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Valor Tabela 4"
                        name="valor_tabela4"
                        value={formData.valor_tabela4}
                        onChange={handleChange}
                        type="number"
                        fullWidth
                    />
                </Grid>
            </Grid>

            {/* Botões de Ação */}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={
                        isLoading ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            <SaveAltRounded />
                        )
                    }
                    onClick={handleSubmit}
                    disabled={
                        isLoading ||
                        !formData.codigo ||
                        !formData.descricao ||
                        !formData.unidade ||
                        !formData.valor_unidade
                    }
                    sx={{
                        opacity: isLoading ? 0.7 : 1,
                        cursor: isLoading ? "progress" : "pointer",
                    }}
                >
                    {isLoading ? "Salvando..." : "Salvar Produto"}
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleClear}
                >
                    Limpar
                </Button>
            </Box>
            <ToastMessage
                status={toastStatus}
                message={message}
                open={openToast}
                onClose={() => setOpenToast(false)}
            />
        </Container>
    );
};
