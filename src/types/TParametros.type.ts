export type TParametros = {
  success: boolean;
  data: TData;
};

export type TData = {
  status: TStatus[];
  cfop: TCfop[];
  proximo_numero_pedido: number;
  proximo_numero_nota: number;
};

export type TStatus = {
  id: number;
  chave: string;
  titulo: string;
  descricao: string;
  model: string;
};

export type TCfop = {
  cfop: string;
  descricao: string;
  entrada_saida: string;
};
