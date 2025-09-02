import { Cancel, Delete, Edit, Save } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

export default function CfopCrud() {
  const [codigo, setCodigo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [indicador, setIndicador] = useState("");
  const [icms, setIcms] = useState("");

  const [cfops, setCfops] = useState<any>([]);

  const [editIndex, setEditIndex] = useState(null);
  const [editItem, setEditItem] = useState<any>(null);

  // Adicionar CFOP
  const handleAdd = () => {
    if (!codigo || !descricao || !indicador || !icms) return;

    const novoCfop = {
      codigo,
      descricao,
      indicador,
      icms,
    };

    setCfops([...cfops, novoCfop]);
    setCodigo("");
    setDescricao("");
    setIndicador("");
    setIcms("");
  };

  // Iniciar edição
  const handleEdit = (index) => {
    setEditIndex(index);
    setEditItem(cfops[index]);
  };

  // Salvar edição
  const handleSave = (index) => {
    const updated = [...cfops];
    updated[index] = editItem;
    setCfops(updated);
    setEditIndex(null);
    setEditItem(null);
  };

  // Cancelar edição
  const handleCancel = () => {
    setEditIndex(null);
    setEditItem(null);
  };

  // Excluir
  const handleDelete = (index) => {
    setCfops(cfops.filter((_, i) => i !== index));
  };

  return (
    <Box p={3} component={Paper} elevation={3} height={'calc(100dvh - 9rem)'}>
      <Box sx={{
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
        }}
        mb={3}>
          <Typography fontWeight={'regular'} fontSize={'24px'}>
            CFOP
          </Typography>
        </Box>

      {/* Formulário */}
      <Box mb={4}>
        <Box display="grid" gridTemplateColumns={'1fr 1fr'} gap={2} mb={3} flexWrap="wrap">
          <TextField
            label="Código"
            type="number"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            sx={{
              '& input[type=number]': {
                MozAppearance: 'textfield', // Firefox
              },
              '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                WebkitAppearance: 'none', // Chrome, Safari, Edge, Opera
                margin: 0,
              }
            }}
          />

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Indicador</InputLabel>
            <Select
              value={indicador}
              onChange={(e) => setIndicador(e.target.value)}
              label="Indicador"
            >
              <MenuItem value="Entrada">Entrada</MenuItem>
              <MenuItem value="Saída">Saída</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="ICMS %"
            type="number"
            value={icms}
            onChange={(e) => setIcms(e.target.value)}
            sx={{
              '& input[type=number]': {
                MozAppearance: 'textfield', // Firefox
              },
              '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                WebkitAppearance: 'none', // Chrome, Safari, Edge, Opera
                margin: 0,
              }
            }}
          />
          <TextField
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            fullWidth
          />
        </Box>
       <Box sx={{width: '100%', display: 'flex', justifyContent: 'end'}}>
         <Button variant="contained" color="primary" onClick={handleAdd} sx={{color: 'white', padding: ".5rem 1rem"}} >
          Adicionar
        </Button>
       </Box>
      </Box>

      {/* Tabela */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Código</TableCell>
            <TableCell>Descrição</TableCell>
            <TableCell>Indicador</TableCell>
            <TableCell>ICMS %</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cfops.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                {editIndex === index ? (
                  <TextField
                    type="number"
                    sx={{
                      '& input[type=number]': {
                        MozAppearance: 'textfield', // Firefox
                      },
                      '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none', // Chrome, Safari, Edge, Opera
                        margin: 0,
                      }
                    }}
                    value={editItem.codigo}
                    onChange={(e) =>
                      setEditItem({ ...editItem, codigo: e.target.value })
                    }
                  />
                ) : (
                  item.codigo
                )}
              </TableCell>
              <TableCell>
                {editIndex === index ? (
                  <TextField
                    value={editItem.descricao}
                    onChange={(e) =>
                      setEditItem({ ...editItem, descricao: e.target.value })
                    }
                  />
                ) : (
                  item.descricao
                )}
              </TableCell>
              <TableCell>
                {editIndex === index ? (
                  <FormControl sx={{ minWidth: 120 }}>
                    <Select
                      value={editItem.indicador}
                      onChange={(e) =>
                        setEditItem({ ...editItem, indicador: e.target.value })
                      }
                    >
                      <MenuItem value="Entrada">Entrada</MenuItem>
                      <MenuItem value="Saída">Saída</MenuItem>
                    </Select>
                  </FormControl>
                ) : (
                  item.indicador
                )}
              </TableCell>
              <TableCell>
                {editIndex === index ? (
                  <TextField
                    type="number"
                    value={editItem.icms}
                    sx={{
                      '& input[type=number]': {
                        MozAppearance: 'textfield', // Firefox
                      },
                      '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                        WebkitAppearance: 'none', // Chrome, Safari, Edge, Opera
                        margin: 0,
                      }
                    }}
                    onChange={(e) =>
                      setEditItem({ ...editItem, icms: e.target.value })
                    }
                  />
                ) : (
                  `${item.icms}%`
                )}
              </TableCell>
              <TableCell align="right">
                {editIndex === index ? (
                  <>
                    <IconButton color="success" onClick={() => handleSave(index)}>
                      <Save />
                    </IconButton>
                    <IconButton color="warning" onClick={handleCancel}>
                      <Cancel />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton color="primary" onClick={() => handleEdit(index)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(index)}>
                      <Delete />
                    </IconButton>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}

          {cfops.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                Nenhum CFOP cadastrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
}
