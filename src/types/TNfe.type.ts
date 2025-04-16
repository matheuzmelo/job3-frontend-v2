export interface NotaFiscalProduto {
  produto_id: number;
  quantidade: number;
  valor_unitario: number;
  desconto: number;
}

export interface NotaFiscalFormData {
  numero: number;
  pessoa_id: number;
  observacoes: string;
  data_emissao: string;
  produtos: NotaFiscalProduto[];
}
