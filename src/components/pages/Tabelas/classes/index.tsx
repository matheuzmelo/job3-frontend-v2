import { Cancel, Delete, Edit, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export const Classes = () => {
  const [nome, setNome] = useState("");
  const [classes, setClasses] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleAdd = () => {
    if (!nome.trim()) return;
    setClasses([...classes, nome]);
    setNome("");
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditValue(classes[index]);
  };

  const handleSave = (index) => {
    const updated = [...classes];
    updated[index] = editValue;
    setClasses(updated);
    setEditIndex(null);
    setEditValue("");
  };

  const handleCancel = () => {
    setEditIndex(null);
    setEditValue("");
  };

  // Remove item
  const handleDelete = (index) => {
    const updated = classes.filter((_, i) => i !== index);
    setClasses(updated);
  };

  return (
    <>

      <Box p={3} component={Paper} elevation={3}>
        <Box sx={{
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
        }}
        mb={3}>
          <Typography fontWeight={'regular'} fontSize={'24px'}>
            Classes
          </Typography>
        </Box>

        <Box display="flex" gap={2} mb={1}>
          <TextField
            label="Nome da Classe"
            variant="outlined"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            fullWidth
          />
          <Button variant="contained" color="primary" onClick={handleAdd} sx={{ color: 'white' }}>
            Adicionar
          </Button>
        </Box>

        {/* Listagem */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  {editIndex === index ? (
                    <TextField
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      fullWidth
                    />
                  ) : (
                    item
                  )}
                </TableCell>
                <TableCell align="right">
                  {editIndex === index ? (
                    <>
                      <IconButton
                        color="success"
                        onClick={() => handleSave(index)}
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
                        onClick={() => handleEdit(index)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(index)}
                      >
                        <Delete />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {classes.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  Nenhuma classe cadastrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </>
  );
}
