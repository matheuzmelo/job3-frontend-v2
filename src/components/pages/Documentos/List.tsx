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
import { useDocumentosContext } from "../../../contexts/documentos.context";

interface DocumentosListProps {
  setAbaAtual?: (value: number) => void;
}

export const List: React.FC<DocumentosListProps> = () => {
  const { documentos, isLoading } = useDocumentosContext();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 15;

  const handleChangePage = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const filteredDocumentos = Array.isArray(documentos)
    ? documentos.filter((doc) => {
        const numeroPedido = String(doc.numero_pedido || "").toLowerCase();
        const cliente = String(doc.cliente || "").toLowerCase();
        const data = String(doc.data_criacao || "").toLowerCase();

        return (
          numeroPedido.includes(searchTerm.toLowerCase()) ||
          cliente.includes(searchTerm.toLowerCase()) ||
          data.includes(searchTerm.toLowerCase())
        );
      })
    : [];

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDocumentos = filteredDocumentos.slice(startIndex, endIndex);

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h5">Lista de Documentos</Typography>
      <Box sx={{ mt: 2, mb: 2 }}>
        <TextField
          label="Buscar por Nº Pedido, Cliente ou Data"
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
                  <TableCell>Nº Pedido</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Tipo de Documento</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentDocumentos.map((doc: any) => (
                  <TableRow key={doc.id}>
                    <TableCell>{doc.numero_pedido}</TableCell>
                    <TableCell>{doc.cliente || '-'}</TableCell>
                    <TableCell>
                      {doc.tipo_documento}
                    </TableCell>
                    <TableCell>
                      {doc.total}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={Math.ceil(filteredDocumentos.length / itemsPerPage)}
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
