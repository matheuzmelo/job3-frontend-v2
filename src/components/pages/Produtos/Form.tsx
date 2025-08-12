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
  TextField
} from "@mui/material";
import { useState } from "react";

import csosn from "../../../mock/csosn.json";
import cstCofins from "../../../mock/cst-cofins.json";
import cstIcms from "../../../mock/cst-icms.json";
import cstIpi from "../../../mock/cst-ipi.json";
import cstPis from "../../../mock/cst-pis.json";

import { currencyMask } from "../../../Utils";
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
    valorUltimaCompra: "",
    custo: "",
    pesoBruto: "",
    pesoLiquido: "",
    estoqueMinimo: "",
    continuacaoDescricao: "",
    codigo: '',

    // Aba Dados Fiscais
    ncm: "",
    situacaoTributariaIcmsCst: "",
    csosn: "",
    cstIpi: "",
    enquadramentoIpi: "",
    cstPis: "",
    cstCofins: "",
    cest: "",
    cfopInterno: "",
    cfopExterno: "",
    icms: "",
    icmsReduzido: "",
    icmsDiferido: "",
    mva: "",
    fcp: "",
    codigoBeneficiario: "",

    // Aba Rastreabilidade
    lote: "",
    validade: "",
    codigoRastreamento: "",
    localizacao: "",
  });

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  // Removida a validação obrigatória conforme demanda
  const isFormValid = true;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCurrencyChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = currencyMask(value);

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };


  const handleCloseToast = () => {
    setShowToast(false)
  }

  const handleSubmit = async () => {
    try {
      const productData = {
        codigo: formData.codigo,
        descricao: formData.descricao,
        unidade: formData.unidadeMedida,
        valor_unidade: Number(formData.preco.replace(/[^\d]/g, "")) / 100,
        valor_atacado: Number(formData.valorAtacado.replace(/[^\d]/g, "")) / 100,
        valor_revenda: Number(formData.valorRevenda.replace(/[^\d]/g, "")) / 100,
        valor_tabela4: Number(formData.valorTabela4.replace(/[^\d]/g, "")) / 100,
        valor_ultima_compra: Number(formData.valorUltimaCompra.replace(/[^\d]/g, "")) / 100,
        custo: Number(formData.custo.replace(/[^\d]/g, "")) / 100,
        peso_bruto: Number(formData.pesoBruto),
        peso_liquido: Number(formData.pesoLiquido),
        estoque_minimo: Number(formData.estoqueMinimo),
        continuacao_descricao: formData.continuacaoDescricao,
        tributacao: {
          ncm: Number(formData.ncm),
          situacao_tributaria_icms_cst: Number(formData.situacaoTributariaIcmsCst),
          csosn: Number(formData.csosn),
          cst_ipi: Number(formData.cstIpi),
          enquadramento_ipi: Number(formData.enquadramentoIpi),
          cst_pis: Number(formData.cstPis),
          cst_cofins: Number(formData.cstCofins),
          cest: Number(formData.cest),
          cfop_interno: Number(formData.cfopInterno),
          cfop_externo: Number(formData.cfopExterno),
          icms: Number(formData.icms),
          icms_reduzidao: Number(formData.icmsReduzido),
          icms_diferido: Number(formData.icmsDiferido),
          mva: Number(formData.mva),
          fcp: Number(formData.fcp),
          codigo_beneficiario: formData.codigoBeneficiario,
        }
      };

      // const createData = await ProdutosService.create(productData);
        console.log(productData)
        setTextToast('Cadastro realizado com sucesso.')
        setStatusToast('success')

    } catch (error) {
      console.error("Erro na requisição:", error);
      setTextToast('Erro ao criar produto.')
      setStatusToast('error')
    } finally {
      setShowToast(true)
    }
  };

  return (
    <Container>
      <Box>
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
            {/* <Tab label="Rastreabilidade" sx={{ fontWeight: "bold" }} /> */}
          </Tabs>
        </Box>

        {/* Aba Geral */}
        <TabPanel value={activeTab} index={0}>
          <Box display={'grid'} rowGap={'.5rem'}>
            <Box display={'flex'} gap={'.5rem'}>
              <Box width={'100%'}>
                <TextField
                  name="codigo"
                  label="Código"
                  value={formData.codigo}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>
              <Box width={'100%'}>
                <FormControl fullWidth >
                  <InputLabel>Unidade</InputLabel>
                  <Select
                    name="unidadeMedida"
                    value={formData.unidadeMedida}
                    label="Unidade"
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
            <Box display={'flex'} gap={'.5rem'}>
              <Box width={'100%'}>
                <TextField
                  name="preco"
                  label="Preço (R$)"
                  value={formData.preco}
                  onChange={handleCurrencyChange}
                  fullWidth
                />
              </Box>
              <Box width={'100%'}>
                <TextField
                  name="valorTabela4"
                  label="Valor Tabela (R$)"
                  value={formData.valorTabela4}
                  onChange={handleCurrencyChange}
                  fullWidth
                />
              </Box>
              <Box width={'100%'}>
                <TextField
                  name="valorAtacado"
                  label="Valor Atacado (R$)"
                  value={formData.valorAtacado}
                  onChange={handleCurrencyChange}
                  fullWidth
                />
              </Box>
              <Box width={'100%'}>
                <TextField
                  name="valorRevenda"
                  label="Valor Revenda (R$)"
                  value={formData.valorRevenda}
                  onChange={handleCurrencyChange}
                  fullWidth
                />
              </Box>
            </Box>
            <Box display={'flex'} gap={'.5rem'}>
              <Box width={'100%'}>
                <TextField
                  name="valorUltimaCompra"
                  label="Valor Última Compra (R$)"
                  value={formData.valorUltimaCompra}
                  onChange={handleCurrencyChange}
                  fullWidth
                />
              </Box>
              <Box width={'100%'}>
                <TextField
                  name="custo"
                  label="Custo (R$)"
                  value={formData.custo}
                  onChange={handleCurrencyChange}
                  fullWidth
                />
              </Box>
              <Box width={'100%'}>
                <TextField
                  name="pesoBruto"
                  label="Peso Bruto (kg)"
                  value={formData.pesoBruto}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                />
              </Box>
              <Box width={'100%'}>
                <TextField
                  name="pesoLiquido"
                  label="Peso Líquido (kg)"
                  value={formData.pesoLiquido}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                />
              </Box>
            </Box>
            <Box display={'flex'} gap={'1rem'}>
              <Box width={'100%'}>
                <TextField
                  name="estoqueMinimo"
                  label="Estoque Mínimo"
                  value={formData.estoqueMinimo}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                />
              </Box>
            </Box>
            <Box>
              <TextField
                name="descricao"
                label="Descrição"
                value={formData.descricao}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Box>
            <Box>
              <TextField
                name="continuacaoDescricao"
                label="Continuação Descrição"
                value={formData.continuacaoDescricao}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </Box>
          </Box> 
        </TabPanel>

        {/* Aba Dados Fiscais */}
        <TabPanel value={activeTab} index={1}>
          <Box display={'grid'} rowGap={'1rem'}>
            <Box display={'flex'} gap={'1rem'}>
              <Box width={'100%'}>
                <TextField
                  name="ncm"
                  label="NCM"
                  value={formData.ncm}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                />
              </Box>
              <Box width={'100%'}>
                <FormControl fullWidth>
                  <InputLabel>Situação Tributária ICMS - CST</InputLabel>
                  <Select
                    name="situacaoTributariaIcmsCst"
                    value={formData.situacaoTributariaIcmsCst}
                    label="Situação Tributária ICMS - CST"
                    onChange={handleChange}
                  >
                    {cstIcms.map((value) => (
                      <MenuItem key={value.codigo} value={value.codigo}>{value.descricao}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box width={'100%'}>
                <FormControl fullWidth>
                  <InputLabel>CSOSN</InputLabel>
                  <Select
                    name="csosn"
                    value={formData.csosn}
                    label="CSOSN"
                    onChange={handleChange}
                  >
                    {csosn.map((value) => (
                      <MenuItem key={value.codigo} value={value.codigo}>{value.descricao}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            
            <Box display={'flex'} gap={'1rem'}>
              <Box width={'100%'}>
                <FormControl fullWidth>
                  <InputLabel>CST IPI</InputLabel>
                  <Select
                    name="cstIpi"
                    value={formData.cstIpi}
                    label="CST IPI"
                    onChange={handleChange}
                  >
                    {cstIpi.map((value) => (
                      <MenuItem key={value.codigo} value={value.codigo}>{value.descricao}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box width={'100%'}>
                <FormControl fullWidth>
                  <InputLabel>Enquadramento IPI</InputLabel>
                  <Select
                    name="enquadramentoIpi"
                    value={formData.enquadramentoIpi}
                    label="Enquadramento IPI"
                    onChange={handleChange}
                  >
                    <MenuItem value={0}>0 - Entrada com recuperação de crédito</MenuItem>
                    <MenuItem value={1}>1 - Entrada tributada com alíquota zero</MenuItem>
                    <MenuItem value={2}>2 - Entrada isenta</MenuItem>
                    <MenuItem value={3}>3 - Entrada não-tributada</MenuItem>
                    <MenuItem value={4}>4 - Entrada imune</MenuItem>
                    <MenuItem value={5}>5 - Entrada com suspensão</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box width={'100%'}>
                <TextField
                  name="cest"
                  label="CEST"
                  value={formData.cest}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                />
              </Box>
            </Box>
            
            <Box display={'flex'} gap={'1rem'}>
              <Box width={'100%'}>
                <FormControl fullWidth>
                  <InputLabel>CST PIS</InputLabel>
                  <Select
                    name="cstPis"
                    value={formData.cstPis}
                    label="CST PIS"
                    onChange={handleChange}
                  >
                    {cstPis.map((value) => (
                      <MenuItem key={value.codigo} value={value.codigo}>{value.descricao}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box width={'100%'}>
                <FormControl fullWidth>
                  <InputLabel>CST COFINS</InputLabel>
                  <Select
                    name="cstCofins"
                    value={formData.cstCofins}
                    label="CST COFINS"
                    onChange={handleChange}
                  >
                    {cstCofins.map((value) => (
                      <MenuItem key={value.codigo} value={value.codigo}>{value.descricao}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            
            <Box display={'flex'} gap={'1rem'}>
              <Box width={'100%'}>
                <FormControl fullWidth>
                  <InputLabel>CFOP Interna</InputLabel>
                  <Select
                    name="cfopInterno"
                    value={formData.cfopInterno}
                    label="CFOP Interna"
                    onChange={handleChange}
                  >
                    {[5101, 5102, 5103, 5104, 5105, 5109, 5401, 5402, 5403, 5405, 5409, 5656].map((value) => (
                      <MenuItem key={value} value={value}>{value}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box width={'100%'}>
                <FormControl fullWidth>
                  <InputLabel>CFOP Externa</InputLabel>
                  <Select
                    name="cfopExterno"
                    value={formData.cfopExterno}
                    label="CFOP Externa"
                    onChange={handleChange}
                  >
                    {[6101, 6102, 6103, 6104, 6105, 6109, 6401, 6402, 6403, 6404, 6409].map((value) => (
                      <MenuItem key={value} value={value}>{value}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
            
            <Box display={'flex'} gap={'1rem'}>
              <Box width={'100%'}>
                <TextField
                  name="icms"
                  label="ICMS (%)"
                  value={formData.icms}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                />
              </Box>
              <Box width={'100%'}>
                <TextField
                  name="icmsReduzido"
                  label="ICMS Reduzido (%)"
                  value={formData.icmsReduzido}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                />
              </Box>
              <Box width={'100%'}>
                <TextField
                  name="icmsDiferido"
                  label="ICMS Diferido (%)"
                  value={formData.icmsDiferido}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                />
              </Box>
            </Box>
            
            <Box display={'flex'} gap={'1rem'}>
              <Box width={'100%'}>
                <TextField
                  name="mva"
                  label="MVA (%)"
                  value={formData.mva}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                />
              </Box>
              <Box width={'100%'}>
                <TextField
                  name="fcp"
                  label="FCP (%)"
                  value={formData.fcp}
                  onChange={handleChange}
                  fullWidth
                  type="number"
                />
              </Box>
              <Box width={'100%'}>
                <TextField
                  name="codigoBeneficiario"
                  label="Código Beneficiário"
                  value={formData.codigoBeneficiario}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>
            </Box>
          </Box>
        </TabPanel>

        {/* Aba Rastreabilidade */}
        <TabPanel value={activeTab} index={2}>
          <Box display={'grid'} rowGap={'1rem'}>
            <Box display={'flex'} gap={'1rem'}>
              <Box width={'100%'}>
                <TextField
                  name="lote"
                  label="Lote"
                  value={formData.lote}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>
              <Box width={'100%'}>
                <TextField
                  name="validade"
                  label="Validade"
                  type="date"
                  value={formData.validade}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Box>
            </Box>
            <Box display={'flex'} gap={'1rem'}>
              <Box width={'100%'}>
                <TextField
                  name="codigoRastreamento"
                  label="Código de Rastreamento"
                  value={formData.codigoRastreamento}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>
              <Box width={'100%'}>
                <TextField
                  name="localizacao"
                  label="Localização"
                  value={formData.localizacao}
                  onChange={handleChange}
                  fullWidth
                />
              </Box>
            </Box>
          </Box>
        </TabPanel>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            id="submit-button"
            variant="contained"
            onClick={handleSubmit}
            disabled={!isFormValid}
            sx={{color: 'white'}}
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