export type TNotaFiscal = {
    id: number;
    numero: number;
    observacoes: string;
    total_notal_fiscal: number;
    pessoa?: {
      primeiro_nome: string;
      segundo_nome: string;
    };
  }
export type TNotaFiscalGroup = TNotaFiscal[];
