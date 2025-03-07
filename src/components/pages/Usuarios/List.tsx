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
  import React, { useEffect, useState } from "react";
  import { useUserContext } from "../../../contexts/usuario.context";
  import { isSuperAdmin } from "../../../Utils";

  interface UserListProps {
    setAbaAtual: (value: number) => void; // Prop para mudar a aba ativa
  }

  export const List: React.FC<UserListProps> = ({ setAbaAtual }) => {
    const { users, setCurrentUser, isLoading } = useUserContext();
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 15;
    const [showCollumn, setShowCollumn] = useState(true);

    useEffect(() => {
      setShowCollumn(isSuperAdmin(localStorage.getItem('token') || ''));
    }, []);

    const handleEdit = (user: any) => {
      setCurrentUser(user);
      setAbaAtual(0);
    };

    const handleChangePage = (_, newPage: number) => {
      setPage(newPage);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
      setPage(1);
    };

    const filteredUsers = Array.isArray(users)
      ? users.filter((user) => {
          const nome = user.nome?.toLowerCase() || "";
          const email = user.email?.toLowerCase() || "";
          const usuario = user.usuario?.toLowerCase() || "";

          return (
            nome.includes(searchTerm.toLowerCase()) ||
            email.includes(searchTerm.toLowerCase()) ||
            usuario.includes(searchTerm.toLowerCase())
          );
        })
      : [];

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Typography variant="h5">Lista de Usuários</Typography>
        <Box sx={{ mt: 2, mb: 2 }}>
          <TextField
            label="Buscar por Nome, Email ou Usuário"
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
                    {showCollumn && <TableCell>Nome</TableCell>}
                    <TableCell>Usuário</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Nível</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentUsers.map((user) => (
                    <TableRow key={user.id}>
                      {showCollumn && <TableCell>{user.nome}</TableCell>}
                      <TableCell>{user.usuario}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.nivel}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEdit(user)}
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
