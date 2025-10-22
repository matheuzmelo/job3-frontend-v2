export interface ProdutoBody {
  codigo: string;
  descricao: string;
  classe_id: number;
  unidade: string | number;
  valor_unidade: number;
  valor_atacado: number;
  valor_revenda: number;
  valor_tabela4: number;
  ncm: string | number;
  situacao_tributaria_icms_cst: string | number;
  csosn: string | number;
  cst_ipi: string | number;
  enquadramento_ipi: string | number;
  cst_pis: string | number;
  cst_cofins: string | number;
  cest: string | number;
  cfop_interno: string | number;
  cfop_externo: string | number;
  codigo_beneficiarioa_tributo: string | number;
  icms: number;
  icms_reduzidao: number;
  icms_diferido: number;
  mva: number;
  fcp: number;
  valor_ultima_compra: number;
  custo: number;
  peso_bruto: number;
  peso_liquido: number;
  estoque_minimo: number;
  continuacao_descricao: string;
}

export interface ProdutoData {
  codigo: string;
  descricao: string;
  unidade: string | number;
  valor_unidade: number;
  valor_atacado: number;
  valor_revenda: number;
  valor_tabela4: number;
  valor_ultima_compra: number;
  custo: number;
  peso_bruto: number;
  peso_liquido: number;
  estoque_minimo: number;
  continuacao_descricao: string;
  tributacao: {
    ncm: string | number;
    situacao_tributaria_icms_cst: string | number;
    csosn: string | number;
    cst_ipi: string | number;
    enquadramento_ipi: string | number;
    cst_pis: string | number;
    cst_cofins: string | number;
    cest: string | number;
    cfop_interno: string | number;
    cfop_externo: string | number;
    codigo_beneficiario: string | number;
    icms: number;
    icms_reduzidao: number;
    icms_diferido: number;
    mva: number;
    fcp: number;
  };
}