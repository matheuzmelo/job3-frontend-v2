import React, { createContext, useEffect } from "react";
import { EmpresasService } from "../services/api/Empresas/Empresas.service";
import { CepService } from "../services/api/CEP/cep.service";
import { DadosCep } from "../types/TCep.type";

interface Empresa {
  id: number;
  cnpj: string;
  inscricao_estadual: string;
  razao_social: string;
  nome_fantasia: string;
  email: string;
  site: string;
  telefone: string;
  cep: string;
  numero_endereco: any;
  complemento: any;
  bairro: string;
  endereco: string;
  cidade: string;
  uf: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

interface EmpresaContextData {
  empresas: Empresa[];
  setEmpresas: (empresas: Empresa[]) => void;
  addEmpresa: (empresa: Empresa) => void;
  getEmpresas: () => any;
  isLoading: boolean;
  consultaCep: (cep: string) => any;
}

const EmpresasContext = createContext<EmpresaContextData | undefined>(
  undefined
);

export const EmpresaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [empresas, setEmpresas] = React.useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const getEmpresas = async () => {
    const empresas = await EmpresasService.getAll();
    setIsLoading(true);

    if (empresas) {
      setIsLoading(false);
      setEmpresas(empresas.data);
    }
    return empresas;
  };
  useEffect(() => {
    getEmpresas();
  }, []);

  const addEmpresa = async (empresa: Empresa) => {
    setIsLoading(true);
    const create_empresa = await EmpresasService.create(empresa);
    setIsLoading(false);
    setEmpresas([...empresas, empresa]);
    return create_empresa;
  };

  const consultaCep = async (cep: string): Promise<DadosCep | undefined> => {
    setIsLoading(true);
    const dados = await CepService.getCepData(cep);
    setIsLoading(false);
    return dados;
  }

  return (
    <EmpresasContext.Provider
      value={{ empresas, setEmpresas, addEmpresa, getEmpresas, isLoading, consultaCep }}
    >
      {children}
    </EmpresasContext.Provider>
  );
};

export const useEmpresasContext = () => {
  const context = React.useContext(EmpresasContext);
  if (context === undefined) throw new Error("useEmpresasContext must be used within a EmpresasProvider");
  return context;
}
