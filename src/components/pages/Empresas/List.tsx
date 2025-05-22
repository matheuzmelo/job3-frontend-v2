import {
  Box,
  Button,
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
import { isSuperAdmin } from "../../../Utils";
import { useEmpresas } from "../../../hooks/useEmpresa";
import { TEmpresa } from "../../../types/TEmpresa";
import GenericModal from "../../organisms/Modal";

export const List: React.FC = () => {
  const [showCollumn, setShowCollumn] = useState(true);
  const [selectedEmpresa, setSelectedEmpresa] = useState<TEmpresa | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data: empresas, isPending: isLoading } = useEmpresas();

  useEffect(() => {
    setShowCollumn(isSuperAdmin(localStorage.getItem("token") || ""));
  }, []);

  const handleOpenEmpresa = (empresa: TEmpresa) => {
    setSelectedEmpresa(empresa);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEmpresa(null);
  };

  const filteredEmpresas = empresas
    ?.filter((empresa) => {
      const searchLower = search.toLowerCase();
      return (
        empresa.nome_fantasia?.toLowerCase().includes(searchLower) ||
        empresa.razao_social?.toLowerCase().includes(searchLower) ||
        empresa.cnpj?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => b.razao_social.localeCompare(a.razao_social));

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h5" mb={2}>
        Lista de Empresas
      </Typography>

      <Box mb={2}>
        <TextField
          label="Pesquisar empresa"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por Nome Fantasia, Razão Social ou CNPJ"
        />
      </Box>

      {isLoading ? (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'60vh'}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {showCollumn && <TableCell>Nome Fantasia</TableCell>}
                <TableCell>Razão Social</TableCell>
                <TableCell>CNPJ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmpresas && filteredEmpresas.length > 0 ? (
                filteredEmpresas.map((empresa) => (
                  <TableRow
                    key={empresa.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleOpenEmpresa(empresa)}
                  >
                    {showCollumn && (
                      <TableCell>{empresa.nome_fantasia}</TableCell>
                    )}
                    <TableCell>{empresa.razao_social}</TableCell>
                    <TableCell>{empresa.cnpj}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={showCollumn ? 3 : 2} align="center">
                    Nenhuma empresa encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <GenericModal
        open={modalOpen}
        onClose={handleCloseModal}
        title="Detalhes da Empresa"
        actions={
          <Button variant="contained" onClick={handleCloseModal}>
            Fechar
          </Button>
        }
      >
        {selectedEmpresa && (
          <Box display="grid" gridTemplateColumns={"1fr 1fr"} gap={1} mt={2}>
            <Typography>
              <strong>CNPJ:</strong> {selectedEmpresa.cnpj || "N/A"}
            </Typography>
            <Typography>
              <strong>Nome Fantasia:</strong>{" "}
              {selectedEmpresa.nome_fantasia || "N/A"}
            </Typography>
            <Typography>
              <strong>Razão Social:</strong>{" "}
              {selectedEmpresa.razao_social || "N/A"}
            </Typography>
            <Typography>
              <strong>Ativo:</strong> {selectedEmpresa.ativo ? "Sim" : "Não"}
            </Typography>
          </Box>
        )}
      </GenericModal>
    </Container>
  );
};
