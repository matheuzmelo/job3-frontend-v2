import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Pagination,
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
import { useEmpresasContext } from "../../../context/empresas.context";

interface UserListProps {
  setAbaAtual: (value: number) => void; // Prop para mudar a aba ativa
}

export const List: React.FC<UserListProps> = ({ setAbaAtual }) => {
  const { empresas, setCurrentEmpresa, isLoading } = useEmpresasContext();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 15;

  const handleEdit = (empresa: any) => {
    setCurrentEmpresa(empresa); // Define a empresa atual no contexto
    setAbaAtual(0); // Muda para a aba do formulário (aba 0)
  };

  const handleChangePage = (
    _,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const filteredEmpresas = Array.isArray(empresas)
    ? empresas.filter((empresa) => {
        return (
          empresa.nome_fantasia
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          empresa.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          empresa.razao_social.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
    : [];

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmpresas = filteredEmpresas.slice(startIndex, endIndex);

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h5">Lista de Empresas</Typography>
      <Box sx={{ mt: 2, mb: 2 }}>
        <TextField
          label="Buscar por Nome Fantasia, Razão Social ou Email"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Box>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome Fantasia</TableCell>
                  <TableCell>Razão Social</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentEmpresas.map((empresa) => (
                  <TableRow key={empresa.id}>
                    <TableCell>{empresa.nome_fantasia}</TableCell>
                    <TableCell>{empresa.razao_social}</TableCell>
                    <TableCell>{empresa.email}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit(empresa)}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={Math.ceil(filteredEmpresas.length / itemsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
          </Box>
        </>
      )}
    </Container>
  );
};
