import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useDocumentosContext } from "../../../contexts/documentos.context";

export const Form: React.FC = () => {
  const { isLoading, addDocumento } = useDocumentosContext();
  const [formData, setFormData] = useState({
    numero_pedido: 0,
    pessoa_id: 0,
    total: 0,
    observacoes: "",
    movimenta_estoque: true,
    tipo_documento: "PEDIDO",
    produtos: [] as any[],
  });

  const [produtoTemp, setProdutoTemp] = useState({
    produto_id: 0,
    quantidade: 1,
    valor_unitario: 0,
    valor_desconto: 0,
    percentual_desconto: 0,
    observacoes: "",
  });

  const handleAddProduto = () => {
    const total_produto = (produtoTemp.quantidade * produtoTemp.valor_unitario) - produtoTemp.valor_desconto;

    setFormData(prev => ({
      ...prev,
      produtos: [...prev.produtos, {
        ...produtoTemp,
        total_produto
      }],
      total: prev.total + total_produto
    }));

    setProdutoTemp({
      produto_id: 0,
      quantidade: 1,
      valor_unitario: 0,
      valor_desconto: 0,
      percentual_desconto: 0,
      observacoes: "",
    });
  };

  const handleSubmit = async () => {
    try {
      if (typeof addDocumento === 'function') { // Verificação de segurança
        await addDocumento(formData);
        // Reset após sucesso
        setFormData({
          numero_pedido: 0,
          pessoa_id: 0,
          total: 0,
          observacoes: "",
          movimenta_estoque: true,
          tipo_documento: "PEDIDO",
          produtos: [],
        });
      } else {
        console.error('addDocumento não é uma função');
      }
    } catch (err) {
      console.error('Erro ao salvar documento:', err);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" gutterBottom>Novo Documento</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Número do Pedido"
            type="number"
            value={formData.numero_pedido}
            onChange={e => setFormData({ ...formData, numero_pedido: Number(e.target.value) })}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="ID da Pessoa"
            type="number"
            value={formData.pessoa_id}
            onChange={e => setFormData({ ...formData, pessoa_id: Number(e.target.value) })}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Observações"
            multiline
            rows={3}
            value={formData.observacoes}
            onChange={e => setFormData({ ...formData, observacoes: e.target.value })}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Produtos</Typography>

          <Grid container spacing={2}>
            <Grid item xs={3}>
              <TextField
                fullWidth
                label="ID Produto"
                type="number"
                value={produtoTemp.produto_id}
                onChange={e => setProdutoTemp({ ...produtoTemp, produto_id: Number(e.target.value) })}
              />
            </Grid>

            <Grid item xs={2}>
              <TextField
                fullWidth
                label="Quantidade"
                type="number"
                value={produtoTemp.quantidade}
                onChange={e => setProdutoTemp({ ...produtoTemp, quantidade: Number(e.target.value) })}
              />
            </Grid>

            <Grid item xs={2}>
              <TextField
                fullWidth
                label="Valor Unitário"
                type="number"
                value={produtoTemp.valor_unitario}
                onChange={e => setProdutoTemp({ ...produtoTemp, valor_unitario: Number(e.target.value) })}
              />
            </Grid>

            <Grid item xs={2}>
              <TextField
                fullWidth
                label="Desconto"
                type="number"
                value={produtoTemp.valor_desconto}
                onChange={e => setProdutoTemp({ ...produtoTemp, valor_desconto: Number(e.target.value) })}
              />
            </Grid>

            <Grid item xs={3}>
              <Button
                variant="contained"
                onClick={handleAddProduto}
                fullWidth
                sx={{ height: '56px' }}
              >
                Adicionar Produto
              </Button>
            </Grid>
          </Grid>

          {formData.produtos.map((produto, index) => (
            <Box key={index} mt={2} p={2} border={1} borderRadius={2}>
              <Typography>Produto ID: {produto.produto_id}</Typography>
              <Typography>Quantidade: {produto.quantidade}</Typography>
              <Typography>Total: R$ {produto.total_produto.toFixed(2)}</Typography>
            </Box>
          ))}
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Salvar Documento'}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};