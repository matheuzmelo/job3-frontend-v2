import React, { createContext, useEffect } from "react";
import { EmpresasService } from "../services/api/Empresas/Empresas.service";
import { DadosCep } from "../types/TCep.type";
import { getDataCep, isSuperAdmin } from "../Utils";

interface Empresa {
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

interface EmpresaContextData {
  empresas: Empresa[];
  setEmpresas: (empresas: Empresa[]) => void;
  addEmpresa: (empresa: Empresa) => Promise<void>;
  getEmpresas: () => any;
  isLoading: boolean;
  consultaCep: (cep: string) => Promise<DadosCep | undefined>;
  currentEmpresa: Empresa | null;
  setCurrentEmpresa: (empresa: Empresa | null) => void;
  setError: (error: any) => any;
  error: any;
}

const EmpresasContext = createContext<EmpresaContextData | undefined>(
  undefined,
);

export const EmpresaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentEmpresa, setCurrentEmpresa] = React.useState<Empresa | null>(
    null,
  );
  const [empresas, setEmpresas] = React.useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<any>(null);

  const getEmpresas = async () => {

    const token = localStorage.getItem('token') || ``
    const adm = isSuperAdmin(token)

    if(!adm) return

    try {
      setIsLoading(true);
      const response = await EmpresasService.getAll();
      setIsLoading(false);
      if (response) {
        setEmpresas(response.data);
      }
    } catch (error) {
      setIsLoading(false);
      setError(error);
    }
  };
  useEffect(() => {
    getEmpresas();
  }, []);



  const addEmpresa = async (empresa: Empresa) => {
    try {
      setIsLoading(true);
      const response: any = await EmpresasService.create(empresa);
      if (response.success) {
        setEmpresas((prevEmpresas) => [...prevEmpresas, response.data]);
        setIsLoading(false);
        return response.data;
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setError(error);
      throw error;
    }
  };

  const consultaCep = async (cep: string): Promise<DadosCep | undefined> => {
    try {
      const dados = await getDataCep(cep);
      return dados;
    } catch (error) {
      setError(error);
    }
  };

  return (
    <EmpresasContext.Provider
      value={{
        empresas,
        setEmpresas,
        addEmpresa,
        getEmpresas,
        isLoading,
        consultaCep,
        currentEmpresa,
        setCurrentEmpresa,
        setError,
        error,
      }}
    >
      {children}
    </EmpresasContext.Provider>
  );
};

export const useEmpresasContext = () => {
  const context = React.useContext(EmpresasContext);
  if (context === undefined)
    throw new Error(
      "useEmpresasContext must be used within a EmpresasProvider",
    );
  return context;
};
