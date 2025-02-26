import { SaveAltRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useUserContext } from "../../../context/usuario.context";

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
  const [empresas, setEmpresas] = useState<any[]>([]); // Inicialize como um array vazio
  const [error, setError] = useState<string | null>(null); // Estado para armazenar erros

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const empresasList = await getEmpresas(); // Assumindo que getEmpresas é uma função assíncrona
        if (Array.isArray(empresasList)) {
          setEmpresas(empresasList); // Atualiza o estado com a lista de empresas
        } else {
          setError("Dados de empresas inválidos."); // Trata caso o retorno não seja um array
        }
      } catch (err) {
        setError("Erro ao carregar empresas."); // Trata erros na requisição
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

  const handleChange: any = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as string]: value }));
  };

  const handleSubmit = () => {
    setIsLoading(true);
    // handleClear();
    addUser({
      nome: formData.nome,
      usuario: formData.usuario,
      tenant_id: String(formData.tenant_id),
      email: formData.email,
      senha: formData.senha,
      nivel: Number(formData.nivel),
    });
    setIsLoading(false);
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

  return (
    <Container maxWidth="xl">
      <Typography variant="h5" sx={{ mb: 2 }}>
        Cadastro de Usuário
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ width: "100%", maxWidth: "400px" }}>
          <TextField
            label="Nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            fullWidth
          />
        </Box>
        <Box sx={{ width: "100%", maxWidth: "400px" }}>
          <TextField
            label="Usuário"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
            fullWidth
          />
        </Box>
        <Box sx={{ width: "100%", maxWidth: "400px" }}>
          <FormControl fullWidth>
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
        <Box sx={{ width: "100%", maxWidth: "400px" }}>
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
        </Box>
        <Box sx={{ width: "100%", maxWidth: "400px" }}>
          <TextField
            label="Senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            fullWidth
          />
        </Box>
        <Box sx={{ width: "100%", maxWidth: "400px" }}>
          <TextField
            label="Nível"
            name="nivel"
            value={formData.nivel}
            onChange={handleChange}
            type="number"
            fullWidth
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
    </Container>
  );
};
