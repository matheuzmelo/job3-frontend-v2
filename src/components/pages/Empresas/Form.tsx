import { SaveAltRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import InputMask from "react-input-mask";
import { useEmpresasContext } from "../../../context/empresas.context";
import ToastMessage from "../../organisms/ToastMessage";

export const Form: React.FC = () => {
  const { currentEmpresa, isLoading, consultaCep, addEmpresa, error, setError } = useEmpresasContext();
  const [formData, setFormData] = useState<any>({
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
  });

  // Estado para controlar o ToastMessage
  const [toast, setToast] = useState({
    open: false,
    status: "success" as "success" | "error",
    message: "",
  });

  // Fecha o ToastMessage
  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (currentEmpresa) {
      setFormData({
        cnpj: currentEmpresa.cnpj,
        razao_social: currentEmpresa.razao_social,
        nome_fantasia: currentEmpresa.nome_fantasia,
        email: currentEmpresa.email,
        telefone: currentEmpresa.telefone,
        cep: currentEmpresa.cep,
        bairro: currentEmpresa.bairro,
        logradouro: currentEmpresa.endereco,
        numero: currentEmpresa.numero_endereco,
        complemento: currentEmpresa.complemento,
        cidade: currentEmpresa.cidade,
        uf: currentEmpresa.uf,
      });
    }
  }, [currentEmpresa]);

  useEffect(() => {
    if (error) {
      setToast({
        open: true,
        status: "error",
        message: error.message || error, // Garante que a mensagem seja uma string
      });
      setError(null);
    }
  }, [error, setError]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cep" && value.length === 8) {
      const cep = value.replace(/\D/g, "");
      const data: any = await consultaCep(cep);
      setFormData((prev) => ({
        ...prev,
        uf: data.state,
        cidade: data.city,
        bairro: data.neighborhood,
        logradouro: data.street,
      }));
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const dataEmpresa: any = {
        cnpj: formData.cnpj,
        razao_social: formData.razao_social,
        nome_fantasia: formData.nome_fantasia,
        email: formData.email,
        telefone: formData.telefone,
        cep: formData.cep,
        bairro: formData.bairro,
        endereco: `${formData.logradouro}, ${formData.numero}, ${formData.complemento}`,
        cidade: formData.cidade,
        uf: formData.uf,
      };

      await addEmpresa(dataEmpresa);

      setToast({
        open: true,
        status: "success",
        message: "Empresa cadastrada com sucesso!",
      });

      // Limpa o formulário após o sucesso
      handleClear();
    } catch (err) {
      // Exibe mensagem de erro
      setToast({
        open: true,
        status: "error",
        message: error?.message || "Erro ao cadastrar a empresa.", // Acessa a propriedade `message` do erro
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
    });
  };

  const isFormValid = () => {
    return Object.values(formData).every((value: any) => value.trim() !== "");
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
        <Grid item xs={12} sm={6} md={4}>
          <InputMask
            mask="99.999.999/9999-99"
            value={formData.cnpj}
            onChange={handleChange}
          >
            {(inputProps: any) => (
              <TextField
                {...inputProps}
                label="CNPJ"
                name="cnpj"
                fullWidth
                required
                onChange={handleChange}
              />
            )}
          </InputMask>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Razão Social"
            name="razao_social"
            value={formData.razao_social}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Nome Fantasia"
            name="nome_fantasia"
            value={formData.nome_fantasia}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="CEP"
            name="cep"
            value={formData.cep}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Bairro"
            name="bairro"
            value={formData.bairro}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Logradouro"
            name="logradouro"
            value={formData.logradouro}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Número"
            name="numero"
            value={formData.numero}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Complemento"
            name="complemento"
            value={formData.complemento}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Cidade"
            name="cidade"
            value={formData.cidade}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="UF"
            name="uf"
            value={formData.uf}
            onChange={handleChange}
            fullWidth
            required
          />
        </Grid>
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
          disabled={isLoading || !isFormValid()}
          sx={{ opacity: isLoading ? 0.7 : 1 }}
        >
          {isLoading ? "Salvando..." : "Salvar Empresa"}
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
    </Container>
  );
};