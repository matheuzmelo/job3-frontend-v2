import { Cancel, Edit, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Pagination,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClassesService } from "../../../../services/api/Classes/classes.service";
import { ParametrosService } from "../../../../services/api/Parmentros/paramentros.service";
import ToastMessage from "../../../organisms/ToastMessage";

export const Classes = () => {
  const [nome, setNome] = useState("");
  const [classes, setClasses] = useState<any[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [showToast, setShowToast] = useState(false);
  const [textToast, setTextToast] = useState("");
  const [statusToast, setStatusToast] = useState<"success" | "error" | "info">("info");

  const itemsPerPage = 4;
  const navigate = useNavigate();

  // Função para exibir toast
  const showToastMessage = (
    message: string,
    status: "success" | "error" | "info" = "info"
  ) => {
    setTextToast(message);
    setStatusToast(status);
    setShowToast(true);
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };

  // Busca inicial de dados
  const getClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToastMessage("Sessão expirada. Efetue o login novamente.", "error");
        navigate(`/`);
        return;
      }

      setLoading(true);
      const response = await ParametrosService.getDataByPage("produtos");

      if (response.success) {
        setClasses(response.data.classes || []);
        localStorage.setItem("classes", JSON.stringify(response.data.classes));
      } else {
        showToastMessage("Erro ao buscar classes.", "error");
      }
    } catch (err) {
      console.error(err);
      showToastMessage("Erro ao carregar classes.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClasses();
  }, []);

  // Adicionar nova classe
  const handleAdd = async () => {
    const trimmed = nome.trim();
    if (!trimmed) {
      showToastMessage("Informe um nome para a classe.", "info");
      return;
    }

    const newClasse = {
      descricao: trimmed,
      chave: trimmed.toUpperCase().replace(/\s+/g, "_"),
    };

    const inserted = await ClassesService.insertClasse(newClasse);
    if (inserted.success) {
      setClasses((prev) => [...prev, inserted.data]);
      setNome("");
      showToastMessage("Classe salva com sucesso!", "success");
    } else {
      showToastMessage("Erro ao salvar classe.", "error");
    }
  };

  // Editar classe
  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditValue(classes[index].descricao);
  };

  const handleSave = async (index: number) => {
    const classe = classes[index];
    const updated = {
      descricao: editValue,
      chave: editValue.toUpperCase().replace(/\s+/g, "_"),
    };

    const response = await ClassesService.updateClasse(classe.id, updated);
    if (response.success) {
      const updatedClasses = [...classes];
      updatedClasses[index] = response.data;
      setClasses(updatedClasses);
      setEditIndex(null);
      setEditValue("");
      showToastMessage("Classe atualizada com sucesso!", "success");
    } else {
      showToastMessage("Erro ao atualizar classe.", "error");
    }
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditValue("");
  };

  // Filtragem e paginação
  const filteredClasses = useMemo(() => {
    return classes.filter((c) =>
      c.descricao.toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => b.id - a.id);
  }, [classes, search]);


  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const paginatedClasses = filteredClasses.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Box p={3} component={Paper} elevation={3} height={"calc(100dvh - 9rem)"}>
      {/* Cabeçalho */}
      <Box
        sx={{ borderBottom: 1, borderColor: "divider", display: "flex" }}
        mb={3}
      >
        <Typography fontWeight="regular" fontSize="24px">
          Classes
        </Typography>
      </Box>

      {/* Adicionar nova classe */}
      <Box display="flex" gap={2}>
        <TextField
          label="Nome da Classe"
          variant="outlined"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAdd}
          sx={{ color: "white" }}
        >
          Adicionar
        </Button>
      </Box>

      <Box marginY={2}>
        <Divider />
      </Box>

      {/* Campo de busca */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Buscar Classe"
          variant="outlined"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          fullWidth
        />
      </Box>

      {/* Tabela */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Nome</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton variant="text" width={40} />
                </TableCell>
                <TableCell>
                  <Skeleton variant="text" width="80%" />
                </TableCell>
                <TableCell align="right" sx={{ display: "flex", gap: 1 }}>
                  <Skeleton variant="circular" width={24} height={24} />
                  <Skeleton variant="circular" width={24} height={24} />
                </TableCell>
              </TableRow>
            ))
          ) : paginatedClasses.length > 0 ? (
            paginatedClasses
              .map((item: any) => {
                const globalIndex = (page - 1) * itemsPerPage + item.id;
                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      {editIndex === globalIndex ? (
                        <TextField
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          fullWidth
                        />
                      ) : (
                        item.descricao
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {editIndex === globalIndex ? (
                        <>
                          <IconButton
                            color="success"
                            onClick={() => handleSave(globalIndex)}
                          >
                            <Save />
                          </IconButton>
                          <IconButton color="warning" onClick={handleCancel}>
                            <Cancel />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(globalIndex)}
                          >
                            <Edit />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
          ) : (
            <TableRow>
              <TableCell colSpan={3} align="center">
                Nenhuma classe encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Paginação */}
      {!loading && totalPages > 1 && (
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Toast */}
      <ToastMessage
        message={textToast}
        status={statusToast}
        open={showToast}
        onClose={handleCloseToast}
      />
    </Box>
  );
};
