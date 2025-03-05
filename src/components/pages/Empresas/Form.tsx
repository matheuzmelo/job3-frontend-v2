import React, { useEffect, useState, useRef } from "react";
import { SaveAltRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import InputMask from "react-input-mask";
import { useEmpresasContext } from "../../../contexts/empresas.context";
import ToastMessage from "../../organisms/ToastMessage";

export const Form: React.FC = () => {
  const {
    currentEmpresa,
    isLoading,
    consultaCep,
    addEmpresa,
    error,
    setError,
  } = useEmpresasContext();
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

  const cnpjRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState({
    open: false,
    status: "success" as "success" | "error",
    message: "",
  });

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
    if (error) {
      setToast({
        open: true,
        status: "error",
        message: error.message || "Erro desconhecido", // Garante que a mensagem seja uma string
      });
      setError(null);
    }
  }, [error, setError]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "cep" && value.replace(/\D/g, "").length === 8) {
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
      } catch (err) {
        setToast({
          open: true,
          status: "error",
          message: "Erro ao consultar CEP. Verifique o CEP e tente novamente.",
        });
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const dataEmpresa = {
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
        inscricao_estadual: formData.inscricao_estadual,
        site: formData.site,
      };

      await addEmpresa(dataEmpresa);

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
  };

  const isFormValid = () => {
    return Object.values(formData).every((value) => {
      if (typeof value === "string") {
        return value.trim() !== "";
      }
      return true; // Para campos que não são strings
    });
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
          >
            {(inputProps: any) => (
              <TextField
                {...inputProps}
                label="CNPJ"
                name="cnpj"
                fullWidth
                required
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
          />
        </Box>
        <Box>
          <InputMask
            mask="(99) 99999-9999"
            value={formData.telefone}
            onChange={handleChange}
          >
            {(inputProps: any) => (
              <TextField
                {...inputProps}
                label="Telefone"
                name="telefone"
                fullWidth
                required
                onChange={handleChange}
              />
            )}
          </InputMask>
        </Box>
        <Box>
          <InputMask
            mask="99999-999"
            value={formData.cep}
            onChange={handleChange}
          >
            {(inputProps: any) => (
              <TextField
                {...inputProps}
                label="CEP"
                name="cep"
                fullWidth
                required
                onChange={handleChange}
              />
            )}
          </InputMask>
        </Box>
        <Box>
          <TextField
            label="Bairro"
            name="bairro"
            value={formData.bairro}
            onChange={handleChange}
            fullWidth
            required
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
