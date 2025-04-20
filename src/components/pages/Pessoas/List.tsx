import {
  Box,
  CircularProgress,
  Container,
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
import { useNavigate } from "react-router-dom";
import { PessoasService } from "../../../services/api/Pessoas/pessoas.service";

export const List: React.FC = () => {
  const [pessoas, setPessoas] = useState<any[]>([]); // Initialize as empty array
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchPessoas = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Sessão expirada. Efetue o Login novamente");
      navigate(`/`);
      return;
    }

    try {
      const { data } = await PessoasService.getAll();

      setPessoas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar as pessoas:", error);
      setPessoas([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPessoas();
  }, []);

  const filteredPessoas = pessoas
    .filter((pessoa) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        (pessoa.primeiro_nome?.toLowerCase() || "").includes(searchTermLower) ||
        (pessoa.segundo_nome?.toLowerCase() || "").includes(searchTermLower) ||
        (pessoa.cpf_cnpj?.toLowerCase() || "").includes(searchTermLower) ||
        (pessoa.email?.toLowerCase() || "").includes(searchTermLower) ||
        (pessoa.cidade?.toLowerCase() || "").includes(searchTermLower)
      );
    })
    .sort((a, b) => {
      const nomeA = `${a.primeiro_nome} ${a.segundo_nome}`.toLowerCase();
      const nomeB = `${b.primeiro_nome} ${b.segundo_nome}`.toLowerCase();
      return nomeA.localeCompare(nomeB);
    });

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h5">Lista de Pessoas</Typography>

      <TextField
        label="Buscar por nome"
        variant="outlined"
        fullWidth
        sx={{ mt: 2, mb: 2 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {!isLoading && filteredPessoas.length == 0 && (
        <Box padding={5}>
          <Typography variant="h5" textAlign={"center"}>
            Nenhuma pessoa listada
          </Typography>
        </Box>
      )}

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
        filteredPessoas.length >= 1 && (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome Completo</TableCell>
                  <TableCell>CPF/CNPJ</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Cidade/UF</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPessoas &&
                  filteredPessoas.map((pessoa) => (
                    <TableRow key={pessoa.cpf_cnpj}>
                      {pessoa.primeiro_nome && (
                        <TableCell>{`${pessoa.primeiro_nome}`}</TableCell>
                      )}
                      {pessoa.cpf_cnpj && (
                        <TableCell>{pessoa.cpf_cnpj}</TableCell>
                      )}
                      {pessoa.email && <TableCell>{pessoa.email}</TableCell>}
                      {pessoa.cidade && (
                        <TableCell>{`${pessoa.cidade} - ${pessoa.uf}`}</TableCell>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )
      )}
    </Container>
  );
};
