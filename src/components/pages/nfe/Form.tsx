import {
  ClearRounded,
  DeleteRounded,
  SaveAltRounded,
} from "@mui/icons-material";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useEffect, useState } from "react";
import { useNfeContext } from "../../../context/nfe.context";
import { NotasFicaisService } from "../../../services/api/NotasFiscais/nfe.service";
import ToastMessage from "../../organisms/ToastMessage";

interface ProdutoSelecionado {
  produto_id: number;
  quantidade: number;
  valor_unitario: number;
}

interface Cliente {
  id: number;
  nome: string;
}

// Dados mockados ajustados
const empresas = [
  { id: 1, nome: "Empresa A" },
  { id: 2, nome: "Empresa B" },
  { id: 3, nome: "Empresa C" },
];

const clientesPorEmpresa: Record<number, Cliente[]> = {
  1: [
    { id: 1, nome: "Cliente A1" },
    { id: 2, nome: "Cliente A2" },
  ],
  2: [
    { id: 3, nome: "Cliente B1" },
    { id: 4, nome: "Cliente B2" },
  ],
  3: [
    { id: 5, nome: "Cliente C1" },
    { id: 6, nome: "Cliente C2" },
  ],
};

const produtosComPrecos = [
  { id: 1, nome: "Produto 1", preco: 100.0 },
  { id: 2, nome: "Produto 2", preco: 200.0 },
  { id: 3, nome: "Produto 3", preco: 150.0 },
];

export const Form: React.FC = () => {
  const { nfeAtual } = useNfeContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    numero: "",
    pessoa_id: "",
  });
  const [empresaId, setEmpresaId] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [produtosDaProposta, setProdutosDaProposta] = useState<
    ProdutoSelecionado[]
  >([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [openToast, setOpenToast] = useState(false);
  const [toastStatus, setToastStatus] = useState<"success" | "alert" | "warn">(
    "success"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const produtosSalvos = localStorage.getItem("produtosDaProposta");
    if (produtosSalvos) {
      setProdutosDaProposta(JSON.parse(produtosSalvos));
    }
  }, []);

  const handleEmpresaChange = (event: SelectChangeEvent): void => {
    const selectedEmpresaId = Number(event.target.value);
    setEmpresaId(selectedEmpresaId.toString());
    setClientes(clientesPorEmpresa[selectedEmpresaId] || []);
    setFormData((prev) => ({ ...prev, pessoa_id: "" }));
  };

  const handleAddProduct = () => {
    const produtoSelecionado = produtosComPrecos.find(
      (p) => p.id === Number(produtoId)
    );
    if (!produtoSelecionado) return;

    const novoProduto: ProdutoSelecionado = {
      produto_id: produtoSelecionado.id,
      quantidade,
      valor_unitario: produtoSelecionado.preco,
    };

    setProdutosDaProposta((prev) => {
      const newProducts =
        editIndex !== null
          ? prev.map((p, i) => (i === editIndex ? novoProduto : p))
          : [...prev, novoProduto];

      localStorage.setItem("produtosDaProposta", JSON.stringify(newProducts));
      return newProducts;
    });

    setProdutoId("");
    setQuantidade(1);
    setEditIndex(null);
  };

  const handleEditProduct = (index: number) => {
    const produto = produtosDaProposta[index];
    setProdutoId(produto.produto_id.toString());
    setQuantidade(produto.quantidade);
    setEditIndex(index);
  };

  const handleDeleteProduct = (index: number) => {
    const novosProdutos = produtosDaProposta.filter((_, i) => i !== index);
    setProdutosDaProposta(novosProdutos);
    localStorage.setItem("produtosDaProposta", JSON.stringify(novosProdutos));
  };

  const handleSave = async () => {
    if (
      !formData.numero ||
      !formData.pessoa_id ||
      produtosDaProposta.length === 0
    ) {
      handleOpenToast("warn", "Preencha todos os campos obrigatórios!");
      return;
    }

    setIsLoading(true); // Ativa o loading

    const nfeData = {
      numero: Number(formData.numero),
      pessoa_id: Number(formData.pessoa_id),
      produtos: produtosDaProposta,
    };

    try {
      const createNfe = await NotasFicaisService.create(nfeData);

      if (createNfe) {
        handleOpenToast("success", "NFe salva com sucesso!");
        handleClear();
      }
    } catch (error) {
      handleOpenToast("warn", "Erro ao salvar NFe!");
    } finally {
      setIsLoading(false); // Desativa o loading em qualquer caso
    }
  };

  const handleClear = () => {
    setFormData({ numero: "", pessoa_id: "" });
    setProdutosDaProposta([]);
    setEmpresaId("");
    setClientes([]);
    localStorage.removeItem("produtosDaProposta");
  };

  const handleOpenToast = (
    status: "success" | "alert" | "warn",
    msg: string
  ) => {
    setToastStatus(status);
    setMessage(msg);
    setOpenToast(true);
  };

  const getNomeProduto = (produtoId: number) => {
    return (
      produtosComPrecos.find((p) => p.id === produtoId)?.nome || "Desconhecido"
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="xl">
        <Typography variant="h5" sx={{ mb: 2 }}>
          Cadastro de Nota Fiscal Eletrônica
        </Typography>

        <Box display={"grid"} gridTemplateColumns={"1fr 1fr"} gap={2}>
          <Box>
            <InputLabel>Número da nota fiscal</InputLabel>
            <TextField
              name="numero"
              value={formData.numero}
              onChange={(e) =>
                setFormData({ ...formData, numero: e.target.value })
              }
              fullWidth
              type="number"
            />
          </Box>

          <Box>
            <InputLabel>Empresa</InputLabel>
            <Select
              fullWidth
              value={empresaId}
              onChange={handleEmpresaChange}
              disabled={!!nfeAtual}
            >
              <MenuItem value="">Selecione a empresa</MenuItem>
              {empresas.map((empresa) => (
                <MenuItem key={empresa.id} value={empresa.id}>
                  {empresa.nome}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
        <Grid item xs={12} sm={6}>
          <InputLabel>Cliente</InputLabel>
          <Select
            fullWidth
            value={formData.pessoa_id}
            onChange={(e) =>
              setFormData({ ...formData, pessoa_id: e.target.value as string })
            }
            disabled={!empresaId}
          >
            <MenuItem value="">Selecione o cliente</MenuItem>
            {clientes.map((cliente) => (
              <MenuItem key={cliente.id} value={cliente.id}>
                {cliente.nome}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Box mt={4}>
          <Typography variant="h6">Produtos</Typography>
          <Box display="flex" gap={2} mt={2}>
            <Select
              fullWidth
              value={produtoId}
              onChange={(e) => setProdutoId(e.target.value as string)}
            >
              <MenuItem value="">Selecione um produto</MenuItem>
              {produtosComPrecos.map((produto) => (
                <MenuItem key={produto.id} value={produto.id}>
                  {produto.nome} - R$ {produto.preco.toFixed(2)}
                </MenuItem>
              ))}
            </Select>

            <TextField
              label="Quantidade"
              type="number"
              value={quantidade}
              onChange={(e) =>
                setQuantidade(Math.max(1, Number(e.target.value)))
              }
              sx={{ width: 150 }}
            />

            <Button
              variant="contained"
              onClick={handleAddProduct}
              disabled={!produtoId}
            >
              {editIndex !== null ? "Atualizar" : "Adicionar"}
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ações</TableCell>
                  <TableCell>Produto</TableCell>
                  <TableCell>Valor Unitário</TableCell>
                  <TableCell>Quantidade</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {produtosDaProposta.map((produto, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Button onClick={() => handleEditProduct(index)}>
                        <EditNoteRoundedIcon />
                      </Button>
                      <Button
                        onClick={() => handleDeleteProduct(index)}
                        color="error"
                      >
                        <DeleteRounded />
                      </Button>
                    </TableCell>
                    <TableCell>{getNomeProduto(produto.produto_id)}</TableCell>
                    <TableCell>
                      R$ {produto.valor_unitario.toFixed(2)}
                    </TableCell>
                    <TableCell>{produto.quantidade}</TableCell>
                    <TableCell>
                      R${" "}
                      {(produto.quantidade * produto.valor_unitario).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box mt={4} display="flex" gap={2}>
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
            onClick={handleSave}
            disabled={
              isLoading ||
              !formData.numero ||
              !formData.pessoa_id ||
              produtosDaProposta.length === 0
            }
            sx={{
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "progress" : "pointer",
            }}
          >
            {isLoading ? "Salvando..." : "Salvar NFe"}
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            startIcon={<ClearRounded />}
            onClick={handleClear}
          >
            Limpar Tudo
          </Button>
        </Box>

        <ToastMessage
          status={toastStatus}
          message={message}
          open={openToast}
          onClose={() => setOpenToast(false)}
        />
      </Container>
    </LocalizationProvider>
  );
};
