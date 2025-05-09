export type TEmpresa = {
  id?: number;
  cnpj: string;
  inscricao_estadual: string;
  razao_social: string;
  nome_fantasia: string;
  email: string;
  site: string;
  telefone: string;
  cep?: string;
  numero_endereco?: any;
  complemento?: any;
  bairro?: string;
  endereco: string;
  cidade?: string;
  uf: string;
  ativo?: boolean;
  created_at?: string;
  updated_at?: string;
}