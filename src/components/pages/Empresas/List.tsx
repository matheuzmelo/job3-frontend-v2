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
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { isSuperAdmin } from "../../../Utils";
import { useEmpresasContext } from "../../../hooks/useEmpresaContext";
import { TEmpresa } from "../../../types/TEmpresa";

interface EmpresaListProps {
  setAbaAtual: (value: number) => void;
}

export const List: React.FC<EmpresaListProps> = ({ setAbaAtual }) => {

  const [showCollumn, setShowCollumn] = useState(true)
  const [business, setBusiness] = useState<TEmpresa[]>([])
  const { empresas, isLoading } = useEmpresasContext() 


  async function fetchData() {
    try{
      setBusiness(empresas)
    }catch(error) {
      console.error(error);
    }
  }

  useEffect(() => {
    console.log(setAbaAtual)
    fetchData()
    setShowCollumn(isSuperAdmin(localStorage.getItem('token') || ''))
  }, [])

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
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {showCollumn ? <TableCell>Nome Fantasia</TableCell> : ''}
                  <TableCell>Razão Social</TableCell>
                  <TableCell>Email</TableCell>
                  {/* <TableCell>Ações</TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {business.map((empresa) => (
                  <TableRow key={empresa.id}>
                    <TableCell>{empresa.nome_fantasia}</TableCell>
                    <TableCell>{empresa.razao_social}</TableCell>
                    <TableCell>{empresa.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Container>
  );
};