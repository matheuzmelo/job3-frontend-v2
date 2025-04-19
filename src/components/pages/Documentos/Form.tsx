import {
  AddCircleOutline,
  DeleteOutline,
  SaveAltRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDocumentosContext } from "../../../contexts/documentos.context";

interface Product {
  produto_id: number;
  quantidade: number;
  valor_unitario: number;
  total_produto: number;
  valor_desconto: number;
  percentual_desconto: number;
  observacoes: string;
}

export const Form: React.FC = () => {
  const { parametros, isLoading, setError, produtos } = useDocumentosContext();

  const [formData, setFormData] = useState({
    numero_pedido: 0,
    pessoa_id: 0,
    total: 0,
    observacoes: "",
    movimenta_estoque: true,
    tipo_documento: "",
    produtos: [] as Product[],
  });

  const [productForm, setProductForm] = useState({
    produto_id: 0,
    quantidade: 0,
    valor_unitario: 0,
    valor_desconto: 0,
    percentual_desconto: 0,
    observacoes: "",
  });

  useEffect(() => {
    if (parametros?.status) {
      const initialStatus = parametros.status[0];
      setFormData((prev) => ({
        ...prev,
        tipo_documento: initialStatus.chave,
        numero_pedido:
          initialStatus.chave === "PEDIDO"
            ? parametros.proximo_numero_pedido
            : parametros.proximo_numero_nota,
      }));
    }
  }, [parametros]);

  const handleAddProduct = () => {
    if (productForm.quantidade <= 0) {
      alert("Informe a quantidade de produtos");
      return;
    }
    if (!productForm.produto_id) {
      setError("Selecione o produto e informe a quantidade");
      return;
    }

    const selectedProduct = produtos.find(
      (p: any) => p.id === productForm.produto_id
    );

    if (!selectedProduct) {
      setError("Produto não encontrado");
      return;
    }

    const totalProduto =
      productForm.quantidade *
        productForm.valor_unitario *
        (1 - productForm.percentual_desconto / 100) -
      productForm.valor_desconto;

    const newProduct: Product = {
      ...productForm,
      total_produto: totalProduto,
      valor_unitario: selectedProduct.preco,
    };

    setFormData((prev) => ({
      ...prev,
      produtos: [...prev.produtos, newProduct],
      total: prev.total + totalProduto,
    }));

    setProductForm({
      produto_id: 0,
      quantidade: 0,
      valor_unitario: 0,
      valor_desconto: 0,
      percentual_desconto: 0,
      observacoes: "",
    });
  };

  const handleProductSelect = (produtoId: number) => {
    const selectedProduct = produtos.find((p) => p.id === produtoId);

    if (selectedProduct) {
      setProductForm((prev) => ({
        ...prev,
        produto_id: produtoId,
        valor_unitario: selectedProduct.preco,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("Dados para envio:", formData);
      // Adicione aqui a chamada API
    } catch (err) {
      setError("Erro ao salvar documento");
    }
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h5" sx={{ mb: 2 }}>
        Cadastro de Documento
      </Typography>

      <Box display="grid" gap={2}>
        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
          gap={2}
        >
          <FormControl fullWidth>
            <InputLabel>Tipo de Documento</InputLabel>
            <Select
              value={formData.tipo_documento}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  tipo_documento: e.target.value as string,
                }))
              }
            >
              {parametros?.status?.map((status) => (
                <MenuItem key={status.id} value={status.chave}>
                  {status.titulo}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Número"
            value={formData.numero_pedido}
            disabled
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>CFOP</InputLabel>
            <Select
              value={formData.tipo_documento}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  tipo_documento: e.target.value,
                }))
              }
            >
              {parametros?.cfop
                ?.filter((c) =>
                  formData.tipo_documento === "PEDIDO"
                    ? c.entrada_saida === "S"
                    : c.entrada_saida === "E"
                )
                .map((cfop) => (
                  <MenuItem key={cfop.cfop} value={cfop.cfop}>
                    {cfop.cfop} - {cfop.descricao}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={formData.movimenta_estoque}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    movimenta_estoque: e.target.checked,
                  }))
                }
              />
            }
            label="Movimenta Estoque"
            labelPlacement="start"
          />
        </Box>

        <Box display="grid" gap={2}>
          <TextField
            label="Observações"
            value={formData.observacoes}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                observacoes: e.target.value,
              }))
            }
            multiline
            rows={3}
            fullWidth
          />
        </Box>

        <Divider />

        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Produtos
          </Typography>

          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
            gap={2}
          >
            <FormControl fullWidth>
              <InputLabel>Produtos</InputLabel>
              <Select
                value={productForm.produto_id}
                onChange={(e) => handleProductSelect(Number(e.target.value))}
              >
                {produtos.map((produto) => (
                  <MenuItem key={produto.id} value={produto.id}>
                    {produto.nome} - {produto.descricao}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Quantidade"
              type="number"
              value={productForm.quantidade}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  quantidade: Number(e.target.value),
                }))
              }
              fullWidth
            />

            <TextField
              label="Valor Unitário"
              type="number"
              value={productForm.valor_unitario}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  valor_unitario: Number(e.target.value),
                }))
              }
              fullWidth
            />

            <TextField
              label="Desconto (R$)"
              type="number"
              value={productForm.valor_desconto}
              onChange={(e) =>
                setProductForm((prev) => ({
                  ...prev,
                  valor_desconto: Number(e.target.value),
                }))
              }
              fullWidth
            />

            <Button
              variant="contained"
              onClick={handleAddProduct}
              startIcon={<AddCircleOutline />}
              sx={{ color: "white" }}
            >
              Adicionar
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Produto</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell align="right">Valor Unitário</TableCell>
                  <TableCell align="right">Desconto (%)</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.produtos
                  .slice() // Cria uma cópia para evitar mutações
                  .sort((a, b) => b.produto_id - a.produto_id) // Ordena em ordem decrescente
                  .map((produto, index) => {
                    const produtoInfo = produtos.find(
                      (p) => p.id === produto.produto_id
                    );
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          {produtoInfo?.nome || "Produto não encontrado"}
                        </TableCell>
                        <TableCell align="right">
                          {produto.quantidade}
                        </TableCell>
                        <TableCell align="right">
                          {produto.valor_unitario}
                        </TableCell>
                        <TableCell align="right">
                          {produto.percentual_desconto}%
                        </TableCell>
                        <TableCell align="right">
                          {produto.total_produto}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            color="error"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                produtos: prev.produtos.filter(
                                  (_, i) => i !== index
                                ),
                              }))
                            }
                          >
                            <DeleteOutline />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ color: "white", padding: "10px 40px" }}
            startIcon={
              isLoading ? <CircularProgress size={20} /> : <SaveAltRounded />
            }
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar Documento"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
