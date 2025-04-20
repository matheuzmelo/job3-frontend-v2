import { SaveAltRounded, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useUserContext } from "../../../contexts/usuario.context";
import ToastMessage from "../../organisms/ToastMessage";

export const UserForm: React.FC = () => {
  const { currentUser, addUser, getEmpresas } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    usuario: "",
    tenant_id: "",
    email: "",
    senha: "",
    nivel: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isAdm] = useState(true); // Supondo que você tenha uma forma de definir isso

  // Estados para o ToastMessage
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastStatus, setToastStatus] = useState<
    "success" | "error" | "warning"
  >("success");

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const empresasList = await getEmpresas();
        if (Array.isArray(empresasList)) {
          setEmpresas(empresasList);
        } else {
          setError("Dados de empresas inválidos.");
        }
      } catch (err) {
        setError("Erro ao carregar empresas.");
        console.error(err);
      }
    };

    fetchEmpresas();

    if (currentUser) {
      setFormData({
        nome: currentUser.nome,
        usuario: currentUser.usuario,
        tenant_id: String(currentUser.tenant_id),
        email: currentUser.email,
        senha: currentUser.senha,
        nivel: Number(currentUser.nivel),
      });
    } else {
      setFormData({
        nome: "",
        usuario: "",
        tenant_id: "",
        email: "",
        senha: "",
        nivel: 0,
      });
    }
  }, [currentUser, getEmpresas]);

  useEffect(() => {
    if (!isAdm && currentUser) {
      setFormData({
        nome: currentUser.nome,
        usuario: currentUser.usuario,
        tenant_id: String(currentUser.tenant_id),
        email: currentUser.email,
        senha: currentUser.senha,
        nivel: Number(currentUser.nivel),
      });
    }
  }, [isAdm, currentUser]);

  const handleChange: any = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as string]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      await addUser({
        nome: formData.nome,
        usuario: formData.usuario,
        tenant_id: String(formData.tenant_id),
        email: formData.email,
        senha: formData.senha,
        nivel: Number(formData.nivel),
      });

      // Exibe toast de sucesso
      setToastMessage("Usuário salvo com sucesso!");
      setToastStatus("success");
      setToastOpen(true);
    } catch (err) {
      // Exibe toast de erro
      setToastMessage("Erro ao salvar usuário.");
      setToastStatus("error");
      setToastOpen(true);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      nome: "",
      usuario: "",
      tenant_id: "",
      email: "",
      senha: "",
      nivel: 0,
    });
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleCloseToast = () => {
    setToastOpen(false);
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h5" sx={{ mb: 2 }}>
        Cadastro de Usuário
      </Typography>
      <Box
        display={"grid"}
        gridTemplateColumns={"repeat(auto-fit, minmax(400px, 1fr))"}
        gap={2}
      >
        <Box sx={{ width: "100%" }}>
          <TextField
            label="Nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            fullWidth
            disabled={!isAdm}
          />
        </Box>
        <Box sx={{ width: "100%" }}>
          <TextField
            label="Usuário"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            fullWidth
            disabled={!isAdm}
          />
        </Box>
        <Box sx={{ width: "100%" }}>
          <FormControl fullWidth disabled={!isAdm}>
            <InputLabel id="empresa-label">Empresa</InputLabel>
            <Select
              labelId="empresa-label"
              id="empresa"
              name="tenant_id"
              value={formData.tenant_id}
              onChange={handleChange}
              label="Empresa"
            >
              {error ? (
                <MenuItem value="">Erro ao carregar empresas</MenuItem>
              ) : empresas.length > 0 ? (
                empresas.map((empresa) => (
                  <MenuItem key={empresa.id} value={empresa.cnpj}>
                    {empresa.nome_fantasia}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">Nenhuma empresa cadastrada</MenuItem>
              )}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ width: "100%" }}>
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            disabled={!isAdm}
          />
        </Box>
        <Box sx={{ width: "100%" }}>
          <TextField
            label="Senha"
            name="senha"
            type={showPassword ? "text" : "password"}
            value={formData.senha}
            onChange={handleChange}
            fullWidth
            disabled={!isAdm}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box sx={{ width: "100%" }}>
          <TextField
            label="Nível"
            name="nivel"
            value={formData.nivel}
            onChange={handleChange}
            type="number"
            fullWidth
            disabled={!isAdm}
          />
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
          disabled={
            isLoading || !formData.nome || !formData.usuario || !formData.email
          }
          sx={{ opacity: isLoading ? 0.7 : 1 }}
        >
          {isLoading ? "Salvando..." : "Salvar Usuário"}
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleClear}>
          Limpar
        </Button>
      </Box>

      {/* ToastMessage */}
      <ToastMessage
        status={toastStatus}
        message={toastMessage}
        open={toastOpen}
        onClose={handleCloseToast}
      />
    </Container>
  );
};
