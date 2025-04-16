import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
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
import { useDocumentosContext } from "../../../contexts/documentos.context";
import { Documento } from "../../../types/TDocumentos.type";

export const List: React.FC<{ setAbaAtual: (value: number) => void }> = ({ setAbaAtual }) => {
  const { documentos, isLoading, getDocumentoById, fetchDocumentos } = useDocumentosContext();
  const [selectedDocumento, setSelectedDocumento] = useState<Documento | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Carrega os documentos ao montar o componente
  useEffect(() => {
    if (typeof fetchDocumentos === 'function') {
      fetchDocumentos();
    } else {
      console.error('fetchDocumentos não é uma função');
    }
  }, [fetchDocumentos]);

  const filteredData = documentos?.filter(doc =>
    doc.numero_pedido?.toString().includes(searchTerm) ||
    doc.cliente?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleOpenDetails = async (id: number) => {
    try {
      if (typeof getDocumentoById === 'function') {
        const documento = await getDocumentoById(id);
        setSelectedDocumento(documento);
      } else {
        console.error('getDocumentoById não é uma função');
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do documento:", error);
    }
  };

  // Atualiza a página
  const handleChangePage = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h5" gutterBottom>Documentos</Typography>

      {/* Campo de busca */}
      <TextField
        fullWidth
        label="Buscar por Número ou Cliente"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(1); // Resetar para a primeira página ao buscar
        }}
        sx={{ mb: 3 }}
      />

      {/* Loading state */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Tabela de documentos */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Número Pedido</TableCell>
                  <TableCell>Cliente</TableCell>
                  <TableCell>Tipo Documento</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Nenhum documento encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData
                    .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                    .map((documento) => (
                      <TableRow key={documento.id}>
                        <TableCell>{documento.numero_pedido}</TableCell>
                        <TableCell>{documento.cliente || 'Não informado'}</TableCell>
                        <TableCell>{documento.tipo_documento}</TableCell>
                        <TableCell>
                          R$ {typeof documento.total === 'number'
                            ? documento.total.toFixed(2)
                            : '0.00'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            onClick={() => documento.id && handleOpenDetails(documento.id)}
                          >
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Paginação */}
          {filteredData.length > itemsPerPage && (
            <Pagination
              count={Math.ceil(filteredData.length / itemsPerPage)}
              page={page}
              onChange={handleChangePage}
              sx={{ mt: 2 }}
            />
          )}
        </>
      )}

      {/* Modal de detalhes */}
      <Dialog
        open={!!selectedDocumento}
        onClose={() => setSelectedDocumento(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedDocumento && (
          <>
            <DialogTitle>
              Detalhes do Documento #{selectedDocumento.id}
            </DialogTitle>
            <DialogContent>
              <Box pt={2}>
                <Typography><strong>Número Pedido:</strong> {selectedDocumento.numero_pedido}</Typography>
                <Typography><strong>Cliente:</strong> {selectedDocumento.cliente || 'Não informado'}</Typography>
                <Typography><strong>Tipo Documento:</strong> {selectedDocumento.tipo_documento}</Typography>
                <Typography><strong>Total:</strong> R$ {selectedDocumento.total?.toFixed(2)}</Typography>
                <Typography><strong>Observações:</strong> {selectedDocumento.observacoes || 'Nenhuma'}</Typography>

                <Typography variant="h6" mt={2}>Produtos:</Typography>

                {selectedDocumento.produtos?.length ? (
                  selectedDocumento.produtos.map((produto, index) => (
                    <Box key={index} p={2} my={1} border={1} borderRadius={2}>
                      <Typography><strong>Produto ID:</strong> {produto.produto_id}</Typography>
                      <Typography><strong>Quantidade:</strong> {produto.quantidade}</Typography>
                      <Typography><strong>Valor Unitário:</strong> R$ {produto.valor_unitario?.toFixed(2)}</Typography>
                      <Typography><strong>Total:</strong> R$ {produto.total_produto?.toFixed(2)}</Typography>
                      <Typography><strong>Observações:</strong> {produto.observacoes || 'Nenhuma'}</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary" mt={2}>
                    Nenhum produto registrado
                  </Typography>
                )}
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
};