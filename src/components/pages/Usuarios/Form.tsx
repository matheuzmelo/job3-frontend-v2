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
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useUserContext } from "../../../context/usuario.context";
import { isSuperAdmin } from "../../../Utils";

export const UserForm: React.FC = () => {
  const { currentUser, addUser, getEmpresas, getUser } = useUserContext();
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

  const token = useMemo(() => localStorage.getItem("token") || "", []);
  const isAdm = useMemo(() => isSuperAdmin(token), [token]);

  const fetchEmpresas = useCallback(async () => {
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
  }, [getEmpresas]);

  useEffect(() => {
    fetchEmpresas();
  }, [fetchEmpresas]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAdm) {
        const {data} = await getUser();
        console.log(data)
        if (data) {
          setFormData({
            nome: data.nome,
            usuario: data.usuario,
            tenant_id: String(data.tenant_id),
            email: data.email,
            senha: data.senha,
            nivel: Number(data.nivel),
          });
        }
      }
    };

    fetchUserData();
  }, [isAdm, currentUser, getUser]);

  const handleChange: any = useCallback(
    (e: any) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name as string]: value }));
    },
    []
  );

  const handleSelectChange = useCallback(
    (e: SelectChangeEvent<string>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(async () => {
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
    } catch (err) {
      setError("Erro ao salvar usuário.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [addUser, formData]);

  const handleClear = useCallback(() => {
    setFormData({
      nome: "",
      usuario: "",
      tenant_id: "",
      email: "",
      senha: "",
      nivel: 0,
    });
  }, []);

  const handleClickShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const isFormValid = useMemo(
    () => formData.nome && formData.usuario && formData.email,
    [formData]
  );

  return (
    <Container maxWidth="xl">
      <Typography variant="h5" sx={{ mb: 2 }}>
        Cadastro de Usuário
      </Typography>
      <Box
        display={"grid"}
        gridTemplateColumns={'repeat(auto-fill ,minmax(400px, 1fr))'}
        gap={2}
      >
        <Box sx={{ width: "100%" }}>
          <TextField
            label="Nome"
            name="nome"
            value={formData.nome}
            fullWidth
            onChange={handleChange}
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
          <FormControl fullWidth>
            <InputLabel id="empresa-label">Empresa</InputLabel>
            <Select
              labelId="empresa-label"
              id="empresa"
              name="tenant_id"
              value={formData.tenant_id} // como pego a empresa do usuário sem destroir o front (ainda mais)?
              onChange={handleChange}
              label="Empresa"
              disabled={!isAdm}
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
          disabled={isLoading || !isFormValid}
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