export type NotaFiscalProduto = {
    produto_id: number;
    quantidade: number;
    valor_unitario: number;
    desconto: number;
  }
export type TNotaFiscal = {
    id?: number;
    numero: number;
    observacoes: string;
    total_notal_fiscal?: number;
    pessoa_id?: number,
    data_emissao?: string,
    pessoa?: {
      primeiro_nome: string;
      segundo_nome: string;
    };
    produtos?:any,
    total?: any
  }
export type TNotaFiscalGroup = TNotaFiscal[];
