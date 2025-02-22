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
  Typography
} from '@mui/material';
import React from 'react';
import { useEmpresasContext } from '../../../context/empresas.context';

interface UserListProps {
  setAbaAtual: (value: number) => void; // Prop para mudar a aba ativa
}

export const List: React.FC<UserListProps> = ({ setAbaAtual }) => {
  const { empresas, setEmpresas,isLoading } = useEmpresasContext();
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const itemsPerPage = 15;

  const handleEdit = (empresa: any) => {
      setEmpresas(empresa); // Define o usuário atual no contexto
      setAbaAtual(0); // Muda para a aba do formulário (aba 0)
  };

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
      console.log(event)
      setPage(newPage);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
      setPage(1);
  };

  // Filtrar usuários com base no termo de busca
  const filteredUsers = empresas.filter((empresa) => {
      return (
          empresa.nome_fantasia.toLowerCase().includes(searchTerm.toLowerCase()) ||
          empresa.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          empresa.razao_social.toLowerCase().includes(searchTerm.toLowerCase())
      );
  });

  // Calcular os usuários que devem ser exibidos na página atual
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

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
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
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
                              {currentUsers.map((empresa) => (
                                  <TableRow key={empresa.id}>
                                      <TableCell>{empresa.nome_fantasia}</TableCell>
                                      <TableCell>{empresa.razao_social}</TableCell>
                                      <TableCell>{empresa.email}</TableCell>
                                      <TableCell>
                                          <Button variant="contained" color="primary" onClick={() => handleEdit(empresa)}>
                                              Editar
                                          </Button>
                                      </TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </TableContainer>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                      <Pagination
                          count={Math.ceil(filteredUsers.length / itemsPerPage)}
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