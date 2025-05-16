import { SaveAltRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import InputMask from "react-input-mask";
import { useCreateEmpresa } from "../../../hooks/useCreateEmpresa";
import { useEmpresasContext } from "../../../hooks/useEmpresaContext";
import { isSuperAdmin } from "../../../Utils";
import GenericModal from "../../organisms/Modal";
import ToastMessage from "../../organisms/ToastMessage";

export const Form: React.FC = () => {
  const { currentEmpresa, isLoading, consultaCep, error } =
    useEmpresasContext();
  const [formData, setFormData] = useState({
    cnpj: "",
    razao_social: "",
    nome_fantasia: "",
    email: "",
    telefone: "",
    cep: "",
    bairro: "",
    logradouro: "",
    numero: "",
    complemento: "",
    cidade: "",
    uf: "",
    inscricao_estadual: "",
    site: "",
  });
  const [newUser, setNewUser] = useState({
    nome: "",
    usuario: "",
    email: "",
    senha: "",
    nivel: 9,
  });
  const [loadingCEP, setLoadingCEP] = useState<boolean>(false)
  const handleAddUser = () => {
    const { nome, email, senha } = newUser;

    if (!nome || !email || !senha) {
      setToast({
        open: true,
        status: "error",
        message: "Preencha nome, email e senha do usuário.",
      });
      return;
    }

    const newUserEntry = {
      id: Math.random().toString(36).substring(2, 9),
      nome,
      usuario: email,
      email,
      senha,
      nivel: 9,
    };

    setAssociatedUsers((prev) => [...prev, newUserEntry]);
    setNewUser({ nome: "", usuario: "", email: "", senha: "", nivel: 9 });
    setIsModalOpen(false);
  };

  const handleRemoveUser = (id: string) => {
    setAssociatedUsers((prev) => prev.filter((user) => user.id !== id));
  };
  const cnpjRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState({
    open: false,
    status: "success" as "success" | "error",
    message: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [associatedUsers, setAssociatedUsers] = useState<
    { id: string; nome: string; email: string,usuario: string, senha: string, nivel: number }[]
  >([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const {mutateAsync: createEmpresa, isPending} = useCreateEmpresa()
  const handleCloseModal = async () => {
    setIsModalOpen(false);
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (currentEmpresa) {
      setFormData({
        cnpj: currentEmpresa.cnpj || "",
        razao_social: currentEmpresa.razao_social || "",
        nome_fantasia: currentEmpresa.nome_fantasia || "",
        email: currentEmpresa.email || "",
        telefone: currentEmpresa.telefone || "",
        cep: currentEmpresa.cep || "",
        bairro: currentEmpresa.bairro || "",
        logradouro: currentEmpresa.endereco || "",
        numero: currentEmpresa.numero_endereco || "",
        complemento: currentEmpresa.complemento || "",
        cidade: currentEmpresa.cidade || "",
        uf: currentEmpresa.uf || "",
        inscricao_estadual: currentEmpresa.inscricao_estadual || "",
        site: currentEmpresa.site || "",
      });
    }
  }, [currentEmpresa]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setToast({
        open: true,
        status: "error",
        message: "Token de autenticação não encontrado. Faça login novamente.",
      });
      return;
    }
    const adm = isSuperAdmin(token);
    setIsAdmin(!adm);

    if (error) {
      setToast({
        open: true,
        status: "error",
        message: error.message || "Erro desconhecido",
      });
    }
  }, [error]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cep" && value.replace(/\D/g, "").length === 8) {
      setLoadingCEP(true)
      const cep = value.replace(/\D/g, "");
      try {

        const data = await consultaCep(cep);
        if (data) {
          setFormData((prev) => ({
            ...prev,
            uf: data.state || "",
            cidade: data.city || "",
            bairro: data.neighborhood || "",
            logradouro: data.street || "",
          }));
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setToast({
          open: true,
          status: "error",
          message: "Erro ao consultar CEP. Verifique o CEP e tente novamente.",
        });
      } finally {
        setLoadingCEP(false)
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (associatedUsers.length === 0) {
      setToast({
        open: true,
        status: "error",
        message: "Selecione pelo menos um usuário para associar.",
      });
      return;
    }

    try {
      const dataEmpresa = {
        cnpj: formData.cnpj,
        razao_social: formData.razao_social,
        nome_fantasia: formData.nome_fantasia,
        email: formData.email,
        telefone: formData.telefone,
        cep: formData.cep,
        bairro: formData.bairro,
        endereco: `${formData.logradouro}, ${formData.numero}, ${formData.complemento || "sem complemento"}`,
        cidade: formData.cidade,
        uf: formData.uf,
        inscricao_estadual: formData.inscricao_estadual,
        site: formData.site,
        usuarios: associatedUsers.map((user) => ({
          nome: user.nome,
          usuario: user.usuario,
          email: user.email,
          senha: user.senha,
          nivel: user.nivel,
        })),
      };

      await createEmpresa(dataEmpresa);
      
      setToast({
        open: true,
        status: "success",
        message: "Empresa cadastrada com sucesso!",
      });

      handleClear();
    } catch (err: any) {
      setToast({
        open: true,
        status: "error",
        message: err.message || "Erro ao cadastrar a empresa.",
      });
    }
  };


  const handleClear = () => {
    setFormData({
      cnpj: "",
      razao_social: "",
      nome_fantasia: "",
      email: "",
      telefone: "",
      cep: "",
      bairro: "",
      logradouro: "",
      numero: "",
      complemento: "",
      cidade: "",
      uf: "",
      inscricao_estadual: "",
      site: "",
    });
    setAssociatedUsers([]);
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h5" sx={{ mb: 2 }}>
        Cadastro de Empresa
      </Typography>
      <Box
        display={"grid"}
        gridTemplateColumns={"repeat(auto-fill, minmax(450px, 1fr))"}
        gap={2}
      >
        {/* Campo CNPJ com Máscara */}
        <Box>
          <InputMask
            mask="99.999.999/9999-99"
            value={formData.cnpj}
            onChange={handleChange}
            disabled={isAdmin}
          >
            {(inputProps: any) => (
              <TextField
                {...inputProps}
                label="CNPJ"
                name="cnpj"
                fullWidth
                required
                disabled={isAdmin}
                onChange={handleChange}
                inputRef={cnpjRef} // Usando ref diretamente no TextField
              />
            )}
          </InputMask>
        </Box>
        <Box>
          <TextField
            label="Razão Social"
            name="razao_social"
            value={formData.razao_social}
            onChange={handleChange}
            fullWidth
            required
            disabled={isAdmin}
          />
        </Box>
        <Box>
          <TextField
            label="Nome Fantasia"
            name="nome_fantasia"
            value={formData.nome_fantasia}
            onChange={handleChange}
            fullWidth
            required
            disabled={isAdmin}
          />
        </Box>
        <Box>
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            disabled={isAdmin}
          />
        </Box>
        <Box>
          <InputMask
            mask="(99) 99999-9999"
            value={formData.telefone}
            onChange={handleChange}
            disabled={isAdmin}
          >
            {(inputProps: any) => (
              <TextField
                {...inputProps}
                label="Telefone"
                name="telefone"
                fullWidth
                required
                disabled={isAdmin}
                onChange={handleChange}
              />
            )}
          </InputMask>
        </Box>
        <Box position={'relative'} display={'flex'} alignItems={'center'}>
          <InputMask
            mask="99999-999"
            value={formData.cep}
            onChange={handleChange}
            disabled={isAdmin}
          >
            {(inputProps: any) => (
              <TextField
                {...inputProps}
                label="CEP"
                name="cep"
                fullWidth
                required
                onChange={handleChange}
                disabled={isAdmin}
              />
            )}
          </InputMask>
          {loadingCEP && (
            <CircularProgress sx={{
              position: 'absolute',
              right:10,
            }}
            size={24} 
            color="inherit" />
          )}
        </Box>
        <Box>
          <TextField
            label="Bairro"
            name="bairro"
            value={formData.bairro}
            onChange={handleChange}
            fullWidth
            required
            disabled={isAdmin}
          />
        </Box>
        <Box>
          <TextField
            label="Logradouro"
            name="logradouro"
            value={formData.logradouro}
            onChange={handleChange}
            fullWidth
            required
            disabled={isAdmin}
          />
        </Box>
        <Box>
          <TextField
            label="Número"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            fullWidth
            required
            disabled={isAdmin}
          />
        </Box>
        <Box>
          <TextField
            label="Complemento"
            name="complemento"
            value={formData.complemento}
            onChange={handleChange}
            fullWidth
            required
            disabled={isAdmin}
          />
        </Box>
        <Box>
          <TextField
            label="Cidade"
            name="cidade"
            value={formData.cidade}
            onChange={handleChange}
            fullWidth
            required
            disabled={isAdmin}
          />
        </Box>
        <Box>
          <TextField
            label="UF"
            name="uf"
            value={formData.uf}
            onChange={handleChange}
            fullWidth
            required
            disabled={isAdmin}
          />
        </Box>
        <Box>
          <TextField
            label="Inscrição Estadual"
            name="inscricao_estadual"
            value={formData.inscricao_estadual}
            onChange={handleChange}
            fullWidth
            required
            disabled={isAdmin}
          />
        </Box>
        <Box>
          <TextField
            label="Site URL"
            name="site"
            value={formData.site}
            onChange={handleChange}
            fullWidth
            required
            disabled={isAdmin}
          />
        </Box>
      </Box>
      <Box margin={'2rem 0'}>
        <Divider />
      </Box>
      <Box sx={{ mt: 4 }}>
        <Box display={"flex"} justifyContent={"space-between"} margin={"1rem 0"} alignItems={"center"}>
          <Typography variant="h6" gutterBottom>
            Usuários Associados
          </Typography>

          <Button
            variant="contained"
            sx={{ mt: 2, padding: '.5rem 2rem', color: 'white' }}
            onClick={() => setIsModalOpen(true)}
          >
            Incluir
          </Button>
        </Box>

        {associatedUsers.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Nenhum usuário associado ainda.
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Nível</TableCell>
                  <TableCell align="right">Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {associatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.nome}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.nivel}</TableCell>
                    <TableCell align="right">
                      <Button
                        variant="text"
                        color="error"
                        onClick={() => handleRemoveUser(user.id)}
                      >
                        Remover
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={
            isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SaveAltRounded />
            )
          }
          onClick={handleSubmit}
          disabled={isPending}
          sx={{ opacity: isLoading ? 0.7 : 1, color: 'white' }}
        >
          {isPending ? "Salvando..." : "Salvar Empresa"}
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleClear}>
          Limpar
        </Button>
      </Box>
      <ToastMessage
        status={toast.status}
        open={toast.open}
        message={toast.message}
        onClose={handleCloseToast}
      />
      <GenericModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title="Incluir Usuário"
        actions={
          <>
            <Button variant="outlined" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="contained" onClick={handleAddUser}>
              Adicionar
            </Button>
          </>
        }
      >
        <Box display="flex" flexDirection="column" gap={2} mt={2}>
          <TextField
            label="Nome"
            name="nome"
            value={newUser.nome}
            onChange={(e) =>
              setNewUser((prev) => ({ ...prev, nome: e.target.value }))
            }
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            fullWidth
          />
          <TextField
            label="Usuário"
            name="usuario"
            value={newUser.usuario}
            onChange={(e) =>
              setNewUser((prev) => ({
                ...prev,
                usuario: e.target.value,
              }))
            }
            fullWidth
          />
          <TextField
            label="Senha"
            name="senha"
            type="password"
            value={newUser.senha}
            onChange={(e) =>
              setNewUser((prev) => ({ ...prev, senha: e.target.value }))
            }
            fullWidth
          />
        </Box>
      </GenericModal>
    </Container>
  );
};
