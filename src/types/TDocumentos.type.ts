export type Documento = {
  id: number;
  numero_pedido: number;
  pessoa_id: number;
  total: number;
  observacoes?: string;
  movimenta_estoque: boolean;
  tipo_documento: string;
  cliente?: string;
  produtos?: Produto[];
};

type Produto = {
  produto_id: number;
  quantidade: number;
  valor_unitario: number;
  total_produto: number;
  valor_desconto?: number;
  percentual_desconto?: number;
  observacoes?: string;
};