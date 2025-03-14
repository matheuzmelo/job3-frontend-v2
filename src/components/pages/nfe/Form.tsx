import React, { useEffect, useState } from "react";
import { SaveAltRounded, AddCircleOutline, DeleteOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import ToastMessage from "../../organisms/ToastMessage";
import { useNotasFiscaisContext } from "../../../contexts/nfe.context";
import { formatCurrency } from "../../../Utils";
import { TNotaFiscal } from "./TNotaFiscal.type";

export const Form: React.FC = () => {
  const {
    currentNotaFiscal,
    isLoading,
    addNotaFiscal,
    error,
    setError,
    clientes,
    produtos,
    getNotasFiscais,
  } = useNotasFiscaisContext();

  const [formData, setFormData] = useState<TNotaFiscal>({
    numero: 0,
    pessoa_id: 0,
    observacoes: "",
    data_emissao: "",
    produtos: [],
  });

  const [toast, setToast] = useState({
    open: false,
    status: "success" as "success" | "error",
    message: "",
  });

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (currentNotaFiscal) {
      setFormData(currentNotaFiscal);
    }
  }, [currentNotaFiscal]);

  useEffect(() => {
    if (error) {
      setToast({
        open: true,
        status: "error",
        message: error.message || "Erro desconhecido",
      });
      setError(null);
    }
  }, [error, setError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      produtos: prev.produtos.filter((_, i) => i !== index)
    }));
  };

  const prepareDataForSubmission = () => {
    // Destructure to omit total and data_emissao
    const { total, data_emissao, ...dataToSubmit } = formData;
    return dataToSubmit;
  };

  const handleSubmit = async () => {
    try {
      const dataToSubmit = prepareDataForSubmission();
      console.log(dataToSubmit);
      await addNotaFiscal(dataToSubmit);
      await getNotasFiscais();
      setToast({
        open: true,
        status: "success",
        message: "Nota fiscal cadastrada com sucesso!",
      });
    } catch (err: any) {
      setToast({
        open: true,
        status: "error",
        message: err.message || "Erro ao cadastrar a nota fiscal.",
      });
    }
  };

  const [productForm, setProductForm] = useState({
    produto_id: 0, // changed from nome to produto_id
    descricao: '',
    preco: 0,
    estoque: 0,
  });

  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProductFormSubmit = () => {
    if (!productForm.produto_id || productForm.preco <= 0) { // updated validation
      setToast({
        open: true,
        status: 'error',
        message: 'Preencha os campos obrigatórios do produto',
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      produtos: [
        ...prev.produtos,
        {
          produto_id: productForm.produto_id, // using selected produto_id
          quantidade: productForm.estoque,
          valor_unitario: productForm.preco,
          desconto: 0
        }
      ]
    }));

    // Reset product form
    setProductForm({
      produto_id: 0, // reset produto_id instead of nome
      descricao: '',
      preco: 0,
      estoque: 0,
    });
  };

  // Add this effect to calculate total
  useEffect(() => {
    const total = formData.produtos.reduce((acc, produto) => {
      return acc + (produto.quantidade * produto.valor_unitario - produto.desconto);
    }, 0);

    setFormData(prev => ({ ...prev, total }));
  }, [formData.produtos]);

  return (
    <Container maxWidth="xl">
      <Typography variant="h5" sx={{ mb: 2 }}>
        Cadastro de Nota Fiscal
      </Typography>
      <Box display={'grid'} gap={2}>
      <Box
        display={"grid"}
        gridTemplateColumns={"repeat(auto-fill, minmax(30%, 1fr))"}
        gap={2}
      >
        <Box >
          <TextField
            label="Número"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            sx={{ width: "33%" }}
            disabled
          />
        </Box>
        <Box display={'flex'} justifyContent={'flex-end'}>
          <TextField
            label="Data de Emissão"
            name="data_emissao"
            type="date"
            value={formData.data_emissao}
            onChange={handleChange}
            sx={{ width: "50%" }}
          />
        </Box>
        <Box >
          <FormControl fullWidth variant="outlined">
            <InputLabel>Cliente/Destinatário</InputLabel>
            <Select
              label="Cliente/Destinatário"
              name="pessoa_id"
              value={formData.pessoa_id}
              onChange={(e) => setFormData((prev) => ({ ...prev, pessoa_id: e.target.value as number }))}
            >
              {clientes.map((cliente) => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  {cliente.primeiro_nome} {cliente.segundo_nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
        <Box>
          <TextField
            label="Observações"
            name="observacoes"
            value={formData.observacoes}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
          />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Produtos
          </Typography>

          <Box display="grid" gap={2} sx={{ mb: 2 }}>
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fill, minmax(20%, 1fr))"
              gap={2}
            >
              <FormControl fullWidth size="small">
                <InputLabel>Produto</InputLabel>
                <Select
                  label="Produto"
                  name="produto_id"
                  value={productForm.produto_id}
                  onChange={(e) => setProductForm(prev => ({ ...prev, produto_id: e.target.value as number }))}
                  fullWidth
                >
                  <MenuItem value={0}>Selecione um produto</MenuItem>
                  {produtos.map((produto) => (
                    <MenuItem key={produto.id} value={produto.id}>
                      {produto.descricao}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Preço"
                name="preco"
                type="number"
                value={productForm.preco}
                onChange={handleProductFormChange}
                size="small"
                fullWidth
              />
              <TextField
                label="Quantidade"
                name="estoque"
                type="number"
                value={productForm.estoque}
                onChange={handleProductFormChange}
                size="small"
                fullWidth
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleProductFormSubmit}
                startIcon={<AddCircleOutline />}
              >
                Adicionar à Lista
              </Button>
            </Box>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Produto</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell align="right">Valor Unitário</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.produtos.map((produto, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {produto.produto_id === 1 ? 'Produto 1' : 'Produto 2'}
                    </TableCell>
                    <TableCell align="right">
                      {produto.quantidade}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(produto.valor_unitario)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(produto.quantidade * produto.valor_unitario - produto.desconto)}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        color="error"
                        onClick={() => handleRemoveProduct(index)}
                        startIcon={<DeleteOutline />}
                      >
                        Remover
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableRow>
                <TableCell colSpan={3} align="right">
                  <Typography variant="subtitle1" fontWeight="bold">
                    Total Geral:
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle1" fontWeight="bold">
                    {formatCurrency(formData.total)}
                  </Typography>
                </TableCell>
                <TableCell />
              </TableRow>
            </Table>
          </TableContainer>
        </Box>
    </Box>
      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
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
          disabled={isLoading}
          sx={{ opacity: isLoading ? 0.7 : 1 }}
        >
          {isLoading ? "Salvando..." : "Salvar Nota Fiscal"}
        </Button>
      </Box>
      <Divider sx={{ my: 4 }} />

      <ToastMessage
        status={toast.status}
        open={toast.open}
        message={toast.message}
        onClose={handleCloseToast}
      />
    </Container>
  );
};
