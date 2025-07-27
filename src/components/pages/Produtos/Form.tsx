import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
import { ProdutosService } from "../../../services/api/Produtos/produtos.service";
import ToastMessage from "../../organisms/ToastMessage";

export const Form = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showToast, setShowToast] = useState<boolean>(false)
  const [textToast, setTextToast] = useState<string>('')
  const [statusToast, setStatusToast] = useState<string>('')
  const [formData, setFormData] = useState({
    // Aba Geral
    nome: "",
    descricao: "",
    categoria: "",
    preco: "",
    unidadeMedida: "",
    valorAtacado: "",
    valorRevenda: "",
    valorTabela4: "",

    // Aba Dados Fiscais
    ncm: "",
    cest: "",
    origem: 0,
    codigoBarras: "",

    // Aba Rastreabilidade
    lote: "",
    validade: "",
    codigoRastreamento: "",
    localizacao: "",
  });

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const isFormValid = Object.values(formData).every(value => value !== '' && value !== null && value !== undefined);


  const handleChange = (e) => {
    
    const { name, value } = e.target;
    console.log(name, value)
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCloseToast = () => {
    setShowToast(false)
  }

  const handleSubmit = async () => {
    try {
      const productData = {
        codigo: formData.codigoBarras,
        descricao: formData.descricao,
        unidade: formData.unidadeMedida,
        valor_unidade: Number(formData.preco),
        valor_atacado: Number(formData.valorAtacado),
        valor_revenda: Number(formData.valorRevenda),
        valor_tabela4: Number(formData.valorTabela4),
      };

      if(Array.prototype.every.call(productData, (x) => !x ? false : true)) {
        setTextToast('Algum dado do form não está preenchido.')
        setStatusToast('warning')
      }     

      const createData = await ProdutosService.create(productData);

      if (createData) {
        setTextToast('Cadastro realizado com sucesso.')
        setStatusToast('success')
      }

    } catch (error) {
      console.error("Erro na requisição:", error);
      setTextToast('Erro ao criar produto.')
      setStatusToast('error')
    } finally {
      setShowToast(true)
    }
  };

  return (
    <Container sx={{ my: 2 }}>
      <Box>
        <Typography variant="h5">Cadastro de Produto</Typography>

        <Box sx={{ borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="standard"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Geral" sx={{ fontWeight: "bold" }} />
            <Tab label="Dados Fiscais" sx={{ fontWeight: "bold" }} />
            <Tab label="Rastreabilidade" sx={{ fontWeight: "bold" }} />
          </Tabs>
        </Box>

        {/* Aba Geral */}
        <TabPanel value={activeTab} index={0}>
          <Box>
            <TextField
              name="nome"
              label="Nome do Produto"
              value={formData.nome}
              onChange={handleChange}
              fullWidth
              required
            />
          </Box>
          <Box>
            <TextField
              name="descricao"
              label="Descrição"
              value={formData.descricao}
              onChange={handleChange}
              fullWidth
              multiline
              margin="normal"
              rows={3}
            />
          </Box>
          <Box display={'grid'} gap={2} gridTemplateColumns={'1fr 1fr'}>
            <Box>
              <TextField
                name="categoria"
                label="Categoria"
                value={formData.categoria}
                onChange={handleChange}
                fullWidth

              />
            </Box>
            <Box>
              <TextField
                name="preco"
                label="Preço (R$)"
                value={formData.preco}
                onChange={handleChange}
                fullWidth
                type="text"
              />
            </Box>
            <Box>
              <TextField
                name="valorTabela4"
                label="Valor Tabela (R$)"
                value={formData.valorTabela4}
                onChange={handleChange}
                fullWidth
                type="text"
              />
            </Box>
            <Box>
              <TextField
                name="valorAtacado"
                label="Valor Atacado (R$)"
                value={formData.valorAtacado}
                onChange={handleChange}
                fullWidth
                type="text"
              />
            </Box>
            <Box>
              <TextField
                name="valorRevenda"
                label="Valor Revenda (R$)"
                value={formData.valorRevenda}
                onChange={handleChange}
                fullWidth
                type="text"
              />
            </Box>
            <Box>
              <FormControl fullWidth >
                <InputLabel>Unidade de Medida</InputLabel>
                <Select
                  name="unidadeMedida"
                  value={formData.unidadeMedida}
                  label="Unidade de Medida"
                  onChange={handleChange}
                >
                  <MenuItem value="un">Unidade</MenuItem>
                  <MenuItem value="kg">Quilograma</MenuItem>
                  <MenuItem value="g">Grama</MenuItem>
                  <MenuItem value="l">Litro</MenuItem>
                  <MenuItem value="ml">Mililitro</MenuItem>
                  <MenuItem value="m">Metro</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </TabPanel>

        {/* Aba Dados Fiscais */}
        <TabPanel value={activeTab} index={1}>
          <Box display={"grid"} gap={2}>
            <Box>
              <TextField
                name="ncm"
                label="NCM"
                value={formData.ncm}
                onChange={handleChange}
                fullWidth
                helperText="Código da Nomenclatura Comum do Mercosul"
              />
            </Box>
            <Box>
              <TextField
                name="cest"
                label="CEST"
                value={formData.cest}
                onChange={handleChange}
                fullWidth
                helperText="Código Especificador da Substituição Tributária"
              />
            </Box>
            <Box>
              <FormControl fullWidth >
                <InputLabel>Origem</InputLabel>
                <Select
                  name="origem"
                  value={formData.origem}
                  label="Origem"
                  onChange={handleChange}
                >
                  <MenuItem value={0}>Nacional</MenuItem>
                  <MenuItem value={1}>Importado</MenuItem>
                  <MenuItem value={2}>
                    Nacional com mais de 40% de conteúdo importado
                  </MenuItem>
                  <MenuItem value={3}>Importado por empresa nacional</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <TextField
                name="codigoBarras"
                label="Código de Barras"
                value={formData.codigoBarras}
                onChange={handleChange}
                fullWidth
              />
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Box display={"grid"} gap={2}>
          <Box>
            <TextField
              name="lote"
              label="Lote"
              value={formData.lote}
              onChange={handleChange}
              fullWidth

            />
          </Box>
          <Box>
            <TextField
              name="validade"
              label="Validade"
              type="date"
              value={formData.validade}
              onChange={handleChange}
              fullWidth
            />
          </Box>
          <Box>
            <TextField
              name="codigoRastreamento"
              label="Código de Rastreamento"
              value={formData.codigoRastreamento}
              onChange={handleChange}
              fullWidth
            />
          </Box>
          <Box>
            <TextField
              name="localizacao"
              label="Localização no Armazém"
              value={formData.localizacao}
              onChange={handleChange}
              fullWidth
            />
          </Box>
          </Box>
        </TabPanel>

        <Box marginTop={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            id="submit-button"
            variant="contained"
            onClick={handleSubmit}
            sx={{ px: 4, py: 1.5, fontWeight: "bold", color: 'white' }}
            disabled={!isFormValid}
          >
            Salvar Produto
          </Button>
        </Box>
      </Box>
      <ToastMessage
        message={textToast}
        status={statusToast}
        open={showToast}
        onClose={handleCloseToast}
      />
    </Container>
  );
};

const TabPanel = ({ children, value, index, ...props }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...props}
    >
      {value === index && <Box margin={'1rem 0'}>{children}</Box>}
    </div>
  );
};
