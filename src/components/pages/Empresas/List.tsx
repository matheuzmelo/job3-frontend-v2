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
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { isSuperAdmin } from "../../../Utils";
import { useEmpresasContext } from "../../../hooks/useEmpresaContext";
import { TEmpresa } from "../../../types/TEmpresa";
import GenericModal from "../../organisms/Modal";

export const List: React.FC = () => {
  const [showCollumn, setShowCollumn] = useState(true);
  const [selectedEmpresa, setSelectedEmpresa] = useState<TEmpresa | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { empresas, isLoading } = useEmpresasContext();

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

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h5">Lista de Empresas</Typography>

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
              {empresas.map((empresa) => (
                <TableRow
                  key={empresa.id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleOpenEmpresa(empresa)}
                >
                  {showCollumn && <TableCell>{empresa.nome_fantasia}</TableCell>}
                  <TableCell>{empresa.razao_social}</TableCell>
                  <TableCell>{empresa.cnpj}</TableCell>
                </TableRow>
              ))}
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
          <Box display="grid" gridTemplateColumns={'1fr 1fr'} gap={1} mt={2}>
            <Typography><strong>CNPJ:</strong> {selectedEmpresa.cnpj ? selectedEmpresa.cnpj : "N/A"}</Typography>
            <Typography><strong>Razão Social:</strong> {selectedEmpresa.razao_social ? selectedEmpresa.razao_social : "N/A"}</Typography>
            <Typography><strong>Nome Fantasia:</strong> {selectedEmpresa.nome_fantasia ? selectedEmpresa.nome_fantasia : "N/A"}</Typography>
            <Typography><strong>Email:</strong> {selectedEmpresa.email ? selectedEmpresa.email : "N/A"}</Typography>
            <Typography><strong>Telefone:</strong> {selectedEmpresa.telefone ? selectedEmpresa.telefone : "N/A"}</Typography>
            <Typography><strong>CEP:</strong> {selectedEmpresa.cep ? selectedEmpresa.cep : "N/A"}</Typography>
            <Typography><strong>Bairro:</strong> {selectedEmpresa.bairro ? selectedEmpresa.bairro : "N/A"}</Typography>
            <Typography><strong>Endereço:</strong> {selectedEmpresa.endereco ? selectedEmpresa.endereco : "N/A"}</Typography>
            <Typography><strong>Cidade:</strong> {selectedEmpresa.cidade ? selectedEmpresa.cidade : "N/A"}</Typography>
            <Typography><strong>UF:</strong> {selectedEmpresa.uf ? selectedEmpresa.uf : "N/A"}</Typography>
            <Typography><strong>Inscrição Estadual:</strong> {selectedEmpresa.inscricao_estadual ? selectedEmpresa.inscricao_estadual : "N/A"}</Typography>
            <Typography><strong>Site:</strong> {selectedEmpresa.site ? selectedEmpresa.site : "N/A"}</Typography>
          </Box>
        )}
      </GenericModal>
    </Container>
  );
};
