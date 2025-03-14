import React, { createContext, useEffect, useState } from "react";
import { NotasFicaisService } from "../services/api/NotasFiscais/nfe.service";
import { PessoasService } from "../services/api/Pessoas/pessoas.service";
import { ProdutosService } from "../services/api/Produtos/produtos.service";
import { TNotaFiscal, TNotaFiscalGroup } from "../components/pages/nfe/TNotaFiscal.type";

interface NotaFiscalContextData {
  notasFiscais: TNotaFiscalGroup;
  setNotasFiscais: (notasFiscais: TNotaFiscalGroup) => void;
  addNotaFiscal: (notaFiscal: TNotaFiscal) => Promise<void>;
  getNotasFiscais: () => any;
  isLoading: boolean;
  currentNotaFiscal: TNotaFiscal | null;
  setCurrentNotaFiscal: (notaFiscal: TNotaFiscal | null) => void;
  setError: (error: any) => any;
  error: any;
  clientes: any[];
  setClientes: (clientes: any[]) => void;
  produtos: any[];
  setProdutos: (produtos: any[]) => void;
}

const NotasFiscaisContext = createContext<NotaFiscalContextData | undefined>(undefined);

export const NotaFiscalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentNotaFiscal, setCurrentNotaFiscal] = useState<TNotaFiscal | null>(null);
  const [notasFiscais, setNotasFiscais] = useState<TNotaFiscalGroup>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [clientes, setClientes] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);

  const getNotasFiscais = async () => {
    try {
      setIsLoading(true);
      const response = await NotasFicaisService.getAll();
      setIsLoading(false);
      if (response) {
        setNotasFiscais(response.data);
      }
    } catch (error) {
      setIsLoading(false);
      setError(error);
    }
  };

  const getClientes = async () => {
    try {
      setIsLoading(true);
      const response = await PessoasService.getAll();
      setIsLoading(false);
      if (response) {
        setClientes(response.data);
      }
    } catch (error) {
      setIsLoading(false);
      setError(error);
    }
  }

  const getProdutos = async () => {
    try {
      setIsLoading(true);
      const response = await ProdutosService.getAll();
      setIsLoading(false);
      if (response) {
        setProdutos(response.data);
      }
    } catch (error) {
      setIsLoading(false);
      setError(error);
    }
  }

  useEffect(() => {
    getNotasFiscais();
    getClientes();
    getProdutos();
  }, []);

  const addNotaFiscal = async (notaFiscal: TNotaFiscal) => {
    try {
      setIsLoading(true);
      const response: any = await NotasFicaisService.create(notaFiscal);
      if (response.success) {
        setNotasFiscais((prevNotasFiscais) => [...prevNotasFiscais, response.data]);
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

  return (
    <NotasFiscaisContext.Provider
      value={{
        notasFiscais,
        setNotasFiscais,
        addNotaFiscal,
        getNotasFiscais,
        isLoading,
        currentNotaFiscal,
        setCurrentNotaFiscal,
        setError,
        error,
        produtos,
        setProdutos,
        clientes,
        setClientes
      }}
    >
      {children}
    </NotasFiscaisContext.Provider>
  );
};

export const useNotasFiscaisContext = () => {
  const context = React.useContext(NotasFiscaisContext);
  if (context === undefined)
    throw new Error("useNotasFiscaisContext must be used within a NotaFiscalProvider");
  return context;
};
