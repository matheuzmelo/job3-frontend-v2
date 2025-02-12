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
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PessoasService } from '../../../services/api/Pessoas/pessoas.service';

export const List: React.FC = () => {
  const [pessoas, setPessoas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchPessoas = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert('Sessão expirada. Efetue o Login novamente');
      navigate(`/`);
    }

    try {
      const pessoasList = await PessoasService.getAll();
      if (pessoasList) {
        setPessoas(pessoasList);
      }
    } catch (error) {
      console.error('Erro ao buscar as pessoas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPessoas();
  }, []);

  const filteredPessoas = pessoas
    .filter(pessoa =>
      `${pessoa.primeiro_nome} ${pessoa.segundo_nome}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

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
          <Typography variant='h5' textAlign={'center'}>Nenhuma pessoa listada</Typography>
        </Box>
      )}


      {isLoading ? (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh'
        }} >
          <CircularProgress />
        </Box>
      ) : (
        filteredPessoas.length > 1 && (
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
                {filteredPessoas.map((pessoa) => (
                  <TableRow key={pessoa.cpf_cnpj}>
                    <TableCell>{`${pessoa.primeiro_nome} ${pessoa.segundo_nome}`}</TableCell>
                    <TableCell>{pessoa.cpf_cnpj}</TableCell>
                    <TableCell>{pessoa.email}</TableCell>
                    <TableCell>{`${pessoa.cidade} - ${pessoa.uf}`}</TableCell>
                  </TableRow>
                ))}

              </TableBody>
            </Table>
          </TableContainer>
        )
      )}
    </Container >
  );
};
