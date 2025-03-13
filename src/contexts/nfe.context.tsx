import React, { createContext, useEffect, useState } from "react";
import { NotasFicaisService } from "../services/api/NotasFiscais/nfe.service";

interface NotaFiscal {
  id?: number;
  numero: number;
  data_emissao: string;
  pessoa_id: number;
  observacoes: string;
  total: number;
  produtos: {
    produto_id: number;
    quantidade: number;
    valor_unitario: number;
    desconto: number;
  }[];
}

interface NotaFiscalContextData {
  notasFiscais: NotaFiscal[];
  setNotasFiscais: (notasFiscais: NotaFiscal[]) => void;
  addNotaFiscal: (notaFiscal: NotaFiscal) => Promise<void>;
  getNotasFiscais: () => any;
  isLoading: boolean;
  currentNotaFiscal: NotaFiscal | null;
  setCurrentNotaFiscal: (notaFiscal: NotaFiscal | null) => void;
  setError: (error: any) => any;
  error: any;
}

const NotasFiscaisContext = createContext<NotaFiscalContextData | undefined>(undefined);

export const NotaFiscalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentNotaFiscal, setCurrentNotaFiscal] = useState<NotaFiscal | null>(null);
  const [notasFiscais, setNotasFiscais] = useState<NotaFiscal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

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

  useEffect(() => {
    getNotasFiscais();
  }, []);

  const addNotaFiscal = async (notaFiscal: NotaFiscal) => {
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
