import { DeleteOutline, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useEffect, useState } from "react";
import { useDocumentosContext } from "../../../contexts/documentos.context";
import {
  PessoaProvider,
  usePessoaContext,
} from "../../../contexts/pessoas.context";
import GenericModal from "../../organisms/Modal";
import { Form as PessoaForm } from "../../pages/Pessoas/Form";
import { FormSkeleton } from "./Loader";
import ToastMessage from "../../organisms/ToastMessage";

interface Product {
  id: number;
  quantidade: number;
  valor_unidade: number;
  total_produto: number;
  subtotal: number;
  unidade: string;
  valor_desconto: number;
  percentual_desconto: number;
  observacoes: string;
}

export const Form: React.FC = () => {
  const { parametros, setError, produtos, isLoading, createDocument } = useDocumentosContext();
  const { pessoas, getPessoas } = usePessoaContext();
  const [toast, setToast] = useState({
    open: false,
    status: "success",
    message: "",
  });
  const [formData, setFormData] = useState({
    numero_pedido: 0,
    pessoa_id: 0,
    total: 0,
    natureza_operacao: '',
    observacoes: "",
    movimenta_estoque: true,
    tipo_documento: "",
    produtos: [] as Product[],
  });

  const [productForm, setProductForm] = useState({
    id: 0,
    quantidade: 0,
    valor_unidade: 0,
    valor_desconto: 0,
    subtotal: 0,
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
    if (!productForm.id) {
      setError("Selecione o produto e informe a quantidade");
      return;
    }

    const selectedProduct = produtos.find((p: any) => p.id === productForm.id);

    if (!selectedProduct) {
      setError("Produto não encontrado");
      return;
    }

    const totalProduto =
      productForm.quantidade *
        productForm.valor_unidade *
        (1 - productForm.percentual_desconto / 100) -
      productForm.valor_desconto;

    setFormData((prev) => {
      const existingProductIndex = prev.produtos.findIndex(
        (produto) => produto.id === productForm.id
      );

      if (existingProductIndex !== -1) {
        const updatedProducts = [...prev.produtos];
        const existingProduct = updatedProducts[existingProductIndex];

        updatedProducts[existingProductIndex] = {
          ...existingProduct,
          quantidade: existingProduct.quantidade + productForm.quantidade,
          subtotal:
            (existingProduct.quantidade + productForm.quantidade) *
            productForm.valor_unidade,
          total_produto: existingProduct.total_produto + totalProduto,
        };

        return {
          ...prev,
          produtos: updatedProducts,
          total: prev.total + totalProduto,
        };
      }

      return {
        ...prev,
        produtos: [
          ...prev.produtos,
          {
            ...productForm,
            total_produto: totalProduto,
            valor_unidade: selectedProduct.valor_unidade,
            unidade: selectedProduct.unidade || "unidade",
          },
        ],
        total: prev.total + totalProduto,
      };
    });


    setProductForm({
      id: 0,
      quantidade: 0,
      valor_unidade: 0,
      valor_desconto: 0,
      percentual_desconto: 0,
      subtotal: 0,
      observacoes: "",
    });
  };

  const handleProductSelect = (produtoId: number) => {
    const selectedProduct = produtos.find((p) => p.id === produtoId);

    if (selectedProduct) {
      setProductForm((prev) => ({
        ...prev,
        id: produtoId,
        valor_unidade: selectedProduct.valor_unidade,
        unidade: selectedProduct.unidade || "unidade",
        subtotal: selectedProduct.preco * prev.quantidade,
        valor_desconto: selectedProduct.valor_desconto || 0,
        percentual_desconto: selectedProduct.percentual_desconto || 0,
      }));
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const handleCreateDocument = async () => {
   
     try{
      const novoDocumento = {
        numero_pedido: formData.numero_pedido,
        pessoa_id: formData.pessoa_id,
        total: Number(formData.total),
        observacoes: formData.observacoes,
        movimenta_estoque: formData.movimenta_estoque,
        tipo_documento: formData.tipo_documento,
        produtos: formData.produtos.map((produto) => ({
          produto_id: produto.id,
          quantidade: produto.quantidade,
          valor_unitario: Number(produto.valor_unidade),
          total_produto: Number(produto.total_produto),
          valor_desconto: Number(produto.valor_desconto),
          percentual_desconto: Number(produto.percentual_desconto),
          observacoes: produto.observacoes,
        })),
      };
      
      await createDocument(novoDocumento);   
      
      setToast({
        message: 'Documento de pedido gerado com sucesso',
        open: true,
        status: 'success'
      })
     }catch(error){
      setToast({
        message: `Erro ao gerar pedido: ${error}`,
        open: true,
        status: 'warn'
      })
     }
  };
  

  const handleCloseModal = async () => {
    setIsModalOpen(false);
    await getPessoas();
  };

  if(isLoading){
    return <FormSkeleton />
  }

  return (
    <Container maxWidth="xl">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Cadastro de Documento
        </Typography>

        <Box display={"grid"} gap={2}>
          <Box
            display={"grid"}
            gridTemplateColumns={"1fr 1fr"}
            justifyContent={"space-between"}
          >
            <Box display="grid" gridTemplateColumns={"repeat(3, 1fr)"} gap={2}>
              <Box>
                <TextField
                  label="Número do Pedido"
                  name="numero_pedido"
                  value={formData.numero_pedido}
                  onChange={(e) =>
                    setFormData({ ...formData, numero_pedido: +e.target.value })
                  }
                  fullWidth
                  disabled
                />
              </Box>
              <Box>
                <TextField
                  label="Tipo de Documento"
                  name="tipo_documento"
                  value={formData.tipo_documento}
                  onChange={(e) =>
                    setFormData({ ...formData, tipo_documento: e.target.value })
                  }
                  fullWidth
                  disabled
                />
              </Box>
              <Box>
                <DatePicker
                  label="Data de Emissão"
                  value={null}
                  onChange={(newValue) => {
                    console.log("Data de Emissão:", newValue);
                  }}
                />
              </Box>
            </Box>
            <Box display="grid" gridTemplateColumns={"repeat(3, 1fr)"} gap={2}>
              <Box
                display={"grid"}
                sx={{
                  gridColumnStart: -1,
                }}
              >
                <TextField
                  label="Data Criação"
                  name="data_criacao"
                  value={new Date().toLocaleDateString()}
                  disabled
                  fullWidth
                />
              </Box>
            </Box>
          </Box>
          <Box width={"100%"}>
            <TextField
              label="Chave de Acesso"
              name="chave_acesso"
              value={formData.numero_pedido}
              disabled
              fullWidth
            />
          </Box>
        </Box>

        <Box display={"grid"} gridTemplateColumns={"1fr 200px"} gap={2}>
          <Box>
            <InputLabel>Cliente</InputLabel>
            <Select
              fullWidth
              variant="outlined"
              value={formData.pessoa_id}
              onChange={(e) => {
                setFormData({ ...formData, pessoa_id: +e.target.value });
                getPessoas();
              }}
            >
              {pessoas.map((pessoa) => (
                <MenuItem key={pessoa.id} value={pessoa.id}>
                  {pessoa.primeiro_nome} {pessoa.segundo_nome}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box
            width={"100%"}
            display={"grid"}
            sx={{
              placeItems: "center",
            }}
          >
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => setIsModalOpen(true)}
              sx={{
                mt: 2,
                padding: "14px 20px",
                marginTop: "20px",
                color: "white",
              }}
            >
              Cadastrar
            </Button>
          </Box>
        </Box>

        <Box display={"flex"} gap={2} mt={2}>
          <Box width={"100%"}>
            <TextField
              label="Natureza da Operação"
              name="natureza_operacao"
              value={formData.natureza_operacao}
              onChange={(e) =>
                setFormData({ ...formData, natureza_operacao: e.target.value })
              }
              fullWidth
            />
          </Box>
          <Box display={"flex"} alignItems={"center"}>
            <InputLabel>Movimenta Estoque</InputLabel>
            <Switch defaultChecked name="movimenta_estoque" />
          </Box>
        </Box>

        <Box display={"flex"} alignItems={"center"} gap={2} mt={2}>
          <Box width={"100%"}>
            <InputLabel>Produto</InputLabel>
            <Select
              fullWidth
              variant="outlined"
              value={productForm.id}
              onChange={(e) => {
                handleProductSelect(+e.target.value);
              }}
            >
              {produtos.map((produto) => (
                <MenuItem key={produto.id} value={produto.id}>
                  {produto.descricao} -{" "}
                  {produto.valor_unidade.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box mt={3}>
            <TextField
              label="Quantidade"
              name="quantidade"
              value={productForm.quantidade}
              onChange={(e) => {
                const quantidade = +e.target.value;
                setProductForm((prev) => ({
                  ...prev,
                  quantidade,
                  subtotal: Number(quantidade * prev.valor_unidade) || 0,
                }));
              }}
              fullWidth
            />
          </Box>
          <Box mt={3}>
            <TextField
              label="Preço"
              name="preco"
              disabled
              value={productForm.valor_unidade}
              fullWidth
            />
          </Box>
          <Box mt={3}>
            <TextField
              label="Subtotal"
              name="subtotal"
              disabled
              value={isNaN(productForm.subtotal) ? 'R$ 0,00' : productForm.subtotal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
              fullWidth
            />
          </Box>
          <Box>
            <Button
              variant="contained"
              onClick={handleAddProduct}
              sx={{
                mt: 2,
                padding: "14px 20px",
                marginTop: "20px",
                color: "white",
              }}
            >
              Incluir
            </Button>
          </Box>
        </Box>

        <Box mt={2}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Produto</TableCell>
                  <TableCell align="right">Quantidade</TableCell>
                  <TableCell align="right">Unidade</TableCell>
                  <TableCell align="right">Valor Unitário</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="center">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formData.produtos.map((produto, index) => {
                  const selectedProduct = produtos.find(
                    (p) => p.id === produto.id
                  );
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        {selectedProduct?.descricao || "Produto não encontrado"}
                      </TableCell>
                      <TableCell align="right">{produto.quantidade}</TableCell>
                      <TableCell align="right">
                        {produto.unidade ?? "-"}
                      </TableCell>
                      <TableCell align="right">
                        {produto.valor_unidade.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                      <TableCell align="right">
                        {produto.subtotal.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                      <TableCell align="right">
                        {produto.total_produto.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          color="error"
                          onClick={() => {
                            const updatedProducts = formData.produtos.filter(
                              (_, i) => i !== index
                            );
                            const updatedTotal = updatedProducts.reduce(
                              (acc, prod) => acc + prod.total_produto,
                              0
                            );
                            setFormData((prev) => ({
                              ...prev,
                              produtos: updatedProducts,
                              total: updatedTotal,
                            }));
                          }}
                        >
                          <DeleteOutline />
                        </Button>
                        {/* TODO: Fazer um modal de edição do produto */}
                        <Button>
                          <Edit />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={1} align="right">
                    <Typography variant="h6">Quantidade Geral:</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">
                      {formData.produtos.reduce(
                        (acc, produto) => acc + produto.quantidade,
                        0
                      )}
                    </Typography>
                  </TableCell>
                  <TableCell colSpan={3} align="right">
                    <Typography variant="h6">Total Geral:</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">
                      {formData.total.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>

        <Box>
          {/* observacao */}
          <TextField
            label="Observações"
            name="observacoes"
            value={formData.observacoes}
            onChange={(e) =>
              setFormData({ ...formData, observacoes: e.target.value })
            }
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mt: 4 }}
          />
        </Box>

        <Box display={"flex"} justifyContent={"space-between"} mt={2}>
          <Box display={"flex"} gap={2}>
          <button onClick={handleCreateDocument} disabled={isLoading}>
            {isLoading ? "Criando..." : "Criar Documento"}
          </button>
            {/* TODO: Fazer a integração com emissão da nota */}
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                console.log("Emitir NFE");
              }}
              sx={{
                padding: "10px 30px",
                marginTop: "20px",
                color: "primary.main",
              }}
            >
              Emitir NFE
            </Button>
          </Box>
          <Box>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setFormData({
                  numero_pedido: formData.numero_pedido,
                  pessoa_id: 0,
                  total: 0,
                  natureza_operacao: '',
                  observacoes: "",
                  movimenta_estoque: true,
                  tipo_documento: "",
                  produtos: [],
                });
              }}
              sx={{
                padding: "10px 30px",
                marginTop: "20px",
                color: "white",
              }}
            >
              Limpar
            </Button>
          </Box>
        </Box>
      </LocalizationProvider>

      <GenericModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title="Criar Usuário"
        actions={
          <Button variant="contained" onClick={handleCloseModal}>
            Fechar
          </Button>
        }
      >
        <PessoaProvider>
          <PessoaForm />
        </PessoaProvider>
      </GenericModal>

      <ToastMessage
        status={toast.status}
        open={toast.open}
        message={toast.message}
        onClose={handleCloseToast}
      />
    </Container>
  );
};
