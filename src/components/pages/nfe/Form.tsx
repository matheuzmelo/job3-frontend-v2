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
import { EmpresasService } from "../../../services/api/Empresas/Empresas.service";
import { NotasFicaisService } from "../../../services/api/NotasFiscais/nfe.service";
import { PessoasService } from "../../../services/api/Pessoas/pessoas.service";
import { ProdutosService } from "../../../services/api/Produtos/produtos.service";
import ToastMessage from "../../organisms/ToastMessage";

interface ProdutoSelecionado {
  produto_id: number;
  quantidade: number;
  valor_unitario: number;
}

interface Cliente {
  id: number;
  primeiro_nome: string;
  segundo_nome: string;
  empresa_id: number;
}

interface Produto {
  id: number;
  nome: string;
  preco: number;
}

export const Form: React.FC = () => {
  const { nfeAtual }: any = useNfeContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    numero: "",
    primeiro_nome: "",
    segundo_nome: "",
    total_notal_fiscal: "",
  });
  const [empresaId, setEmpresaId] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [produtosDaProposta, setProdutosDaProposta] = useState<ProdutoSelecionado[]>([]);
  const [pessoas, setPessoas] = useState<Cliente[]>([]);
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [produtosComPrecos, setProdutosComPrecos] = useState<Produto[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [openToast, setOpenToast] = useState(false);
  const [toastStatus, setToastStatus] = useState<"success" | "alert" | "warn">("success");
  const [message, setMessage] = useState("");

  // Carrega empresas e produtos ao iniciar o componente
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const empresasResponse = await EmpresasService.getAll();
        setEmpresas(empresasResponse.data);

        const produtosResponse = await ProdutosService.getAll();
        setProdutosComPrecos(produtosResponse.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        handleOpenToast("warn", "Erro ao carregar empresas ou produtos.");
      }
    };

    carregarDados();
  }, []);

  // Carrega pessoas da empresa selecionada
  useEffect(() => {
    const carregarPessoas = async () => {
      if (empresaId) {
        try {
          const pessoasResponse = await PessoasService.getAll();
          const pessoasFiltradas = pessoasResponse.data.filter(
            (pessoa: any) => pessoa.empresa_id === Number(empresaId)
          );
          setPessoas(pessoasFiltradas);
        } catch (error) {
          console.error("Erro ao carregar pessoas:", error);
          handleOpenToast("warn", "Erro ao carregar clientes.");
        }
      }
    };

    carregarPessoas();
  }, [empresaId]);

  // Preenche o formulário com os dados da nota fiscal atual
  useEffect(() => {
    if (nfeAtual) {
      setFormData({
        numero: nfeAtual.numero.toString(),
        primeiro_nome: nfeAtual.pessoa.primeiro_nome,
        segundo_nome: nfeAtual.pessoa.segundo_nome,
        total_notal_fiscal: nfeAtual.total_notal_fiscal,
      });

      // Preenche os produtos da nota fiscal (se houver)
      if (nfeAtual.produtos) {
        const produtosFormatados = nfeAtual.produtos.map((produto: any) => ({
          produto_id: produtosComPrecos.find((p) => p.nome === produto.descricao)?.id || 0,
          quantidade: Number(produto.quantidade),
          valor_unitario: Number(produto.valor_unitario),
        }));
        setProdutosDaProposta(produtosFormatados);
      }

      // Tenta encontrar a empresa e o cliente com base nos dados da nota fiscal
      if (nfeAtual.pessoa) {
        const cliente = pessoas.find(
          (p) =>
            p.primeiro_nome === nfeAtual.pessoa.primeiro_nome &&
            p.segundo_nome === nfeAtual.pessoa.segundo_nome
        );
        if (cliente) {
          setClienteId(cliente.id.toString());
          setEmpresaId(cliente.empresa_id.toString());
        }
      }
    }
  }, [nfeAtual, produtosComPrecos, pessoas]);

  const handleEmpresaChange = (event: SelectChangeEvent): void => {
    const selectedEmpresaId = event.target.value;
    setEmpresaId(selectedEmpresaId);
    setClienteId(""); // Limpa o cliente ao mudar a empresa
    setFormData((prev) => ({ ...prev, primeiro_nome: "", segundo_nome: "" }));
  };

  const handleClienteChange = (event: SelectChangeEvent): void => {
    const selectedClienteId = event.target.value;
    setClienteId(selectedClienteId);

    // Preenche os campos de nome do cliente
    const clienteSelecionado = pessoas.find((p) => p.id === Number(selectedClienteId));
    if (clienteSelecionado) {
      setFormData({
        ...formData,
        primeiro_nome: clienteSelecionado.primeiro_nome,
        segundo_nome: clienteSelecionado.segundo_nome,
      });
    }
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
      !formData.primeiro_nome ||
      !formData.segundo_nome ||
      produtosDaProposta.length === 0
    ) {
      handleOpenToast("warn", "Preencha todos os campos obrigatórios!");
      return;
    }

    setIsLoading(true); // Ativa o loading

    const nfeData = {
      numero: Number(formData.numero),
      pessoa_id: Number(clienteId),
      empresa_id: Number(empresaId),
      total_notal_fiscal: formData.total_notal_fiscal,
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
    setFormData({
      numero: "",
      primeiro_nome: "",
      segundo_nome: "",
      total_notal_fiscal: "",
    });
    setProdutosDaProposta([]);
    setEmpresaId("");
    setClienteId("");
    setPessoas([]);
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
                  {empresa.nome_fantasia}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box>
            <InputLabel>Cliente</InputLabel>
            <Select
              fullWidth
              value={clienteId}
              onChange={handleClienteChange}
              disabled={!empresaId}
            >
              <MenuItem value="">Selecione o cliente</MenuItem>
              {pessoas.map((cliente) => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  {cliente.primeiro_nome} {cliente.segundo_nome}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box>
            <InputLabel>Total da Nota Fiscal</InputLabel>
            <TextField
              name="total_notal_fiscal"
              value={formData.total_notal_fiscal}
              onChange={(e) =>
                setFormData({ ...formData, total_notal_fiscal: e.target.value })
              }
              fullWidth
              type="number"
            />
          </Box>
        </Box>

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
                  {produto.nome} - R$ {produto.preco}
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
              !formData.primeiro_nome ||
              !formData.segundo_nome ||
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