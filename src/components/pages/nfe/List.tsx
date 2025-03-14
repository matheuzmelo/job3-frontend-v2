import {
  Box,
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
} from "@mui/material";
import React, { useState } from "react";
import { useNotasFiscaisContext } from "../../../contexts/nfe.context";
import { formatCurrency } from "../../../Utils";

  interface NotaFiscalListProps {
    setAbaAtual: (value: number) => void;
  }

  export const List: React.FC<NotaFiscalListProps> = () => {
    const { notasFiscais, isLoading } = useNotasFiscaisContext();
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 15;

    const handleChangePage = (_, newPage: number) => {
      setPage(newPage);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
      setPage(1);
    };
    const filteredNotasFiscais = Array.isArray(notasFiscais)
      ? notasFiscais.filter(notaFiscal  => {
          const numero = notaFiscal.numero?.toString() || "";
          const nomeCompleto = `${notaFiscal.pessoa?.primeiro_nome || ''} ${notaFiscal.pessoa?.segundo_nome || ''}`.toLowerCase();
          const observacoes = notaFiscal.observacoes?.toLowerCase() || "";

          return (
            numero.includes(searchTerm.toLowerCase()) ||
            nomeCompleto.includes(searchTerm.toLowerCase()) ||
            observacoes.includes(searchTerm.toLowerCase())
          );
        })
      : [];

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentNotasFiscais = filteredNotasFiscais.slice(startIndex, endIndex);
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Typography variant="h5">Lista de Notas Fiscais</Typography>
        <Box sx={{ mt: 2, mb: 2 }}>
          <TextField
            label="Buscar por Número, Nome do Cliente ou Observações"
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
                    <TableCell>Número</TableCell>
                    {/* <TableCell>Data de Emissão</TableCell> */}
                    <TableCell>Cliente/Destinatário</TableCell>
                    {/* <TableCell>Observações</TableCell> */}
                    <TableCell>Total</TableCell>
                    {/* <TableCell>Ações</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentNotasFiscais.map((notaFiscal, index) => (
                    <TableRow key={index}>
                      <TableCell>{notaFiscal.numero}</TableCell>
                      {/* <TableCell>{notaFiscal.data_emissao}</TableCell> */}
                      <TableCell>
                        {`${notaFiscal.pessoa?.primeiro_nome || ''} ${notaFiscal.pessoa?.segundo_nome || ''}`}
                      </TableCell>
                      {/* <TableCell>{notaFiscal.observacoes}</TableCell> */}
                      <TableCell>{notaFiscal.total_notal_fiscal !== undefined ? formatCurrency(notaFiscal.total_notal_fiscal) : '-'}</TableCell>
                      {/* <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleEdit(notaFiscal)}
                        >
                          Editar
                        </Button>
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={Math.ceil(filteredNotasFiscais.length / itemsPerPage)}
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
