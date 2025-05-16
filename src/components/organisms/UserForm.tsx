import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useUserContext } from "../../hooks/useUsuarioContext";

export const UserFormSimple: React.FC = () => {
  const {setBusinessUsers} = useUserContext()
  const [form, setForm] = useState({
    nome: "",
    usuario: "",
    email: "",
    senha: "",
    nivel: 9,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "nivel" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Usuário gerado:", form);
    setBusinessUsers(form)
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      display="flex"
      flexDirection="column"
      gap={2}
      maxWidth={400}
      marginTop={4}
    >
      <Typography variant="h6">Cadastro de Usuário</Typography>

      <TextField
        label="Nome"
        name="nome"
        value={form.nome}
        onChange={handleChange}
        fullWidth
        required
      />

      <TextField
        label="Usuário"
        name="usuario"
        value={form.usuario}
        onChange={handleChange}
        fullWidth
        required
      />

      <TextField
        label="Email"
        name="email"
        value={form.email}
        onChange={handleChange}
        fullWidth
        type="email"
        required
      />

      <TextField
        label="Senha"
        name="senha"
        value={form.senha}
        onChange={handleChange}
        fullWidth
        type="password"
        required
      />

      <TextField
        label="Nível"
        name="nivel"
        value={form.nivel}
        onChange={handleChange}
        fullWidth
        required
        select
      >
        <MenuItem value={1}>Usuário</MenuItem>
        <MenuItem value={5}>Gerente</MenuItem>
        <MenuItem value={9}>Admin</MenuItem>
      </TextField>

      <Button type="submit" variant="contained" color="primary">
        Criar Usuário
      </Button>
    </Box>
  );
};
