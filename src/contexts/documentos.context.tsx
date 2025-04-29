import React, { createContext, useEffect, useState } from "react";
import { ProdutosService } from "../services/api/Produtos/produtos.service";
import { TData } from "../types/TParametros.type";
import { ParametrosService } from "../services/api/Parmentros/paramentros.service";
import { DocumentosService } from "../services/api/Documenos/documentos.service";

interface IDocumentosContext {
  parametros: TData | null;
  isLoading: boolean;
  setError: (error: any) => void;
  error: any;
  produtos: any;
  createDocument: (data: any) => Promise<void>;
  documentos: any;
}

const DocumentosContext = createContext<IDocumentosContext | undefined>(undefined);

export const DocumentosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [parametros, setParametros] = useState<TData | null>(null);
  const [produtos, setProdutos] = useState<any>([]);
  const [documentos, setDocumentos] = useState<any>([]);

  const getParametros = async () => {
    try {
      setIsLoading(true);
      const response = await ParametrosService.getDataByPage('documentos');
      if (response.success) {
        setParametros(response.data);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProdutos = async () => {
    try {
      setIsLoading(true);
      const { data } = await ProdutosService.getAll();
      setProdutos(data);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProdutos();
    getParametros();
  }, []);

  const createDocument = async (data: any) => {
    try {
      setIsLoading(true);
      const response: any = await DocumentosService.create(data.numero_pedido, data);

      if (response.success) {
        setDocumentos((prev) => [...prev, response.data]);
      } else {
        throw new Error('Erro ao criar documento');
      }
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DocumentosContext.Provider
      value={{
        parametros,
        isLoading,
        setError,
        error,
        produtos,
        createDocument,
        documentos,
      }}
    >
      {children}
    </DocumentosContext.Provider>
  );
};

export const useDocumentosContext = () => {
  const context = React.useContext(DocumentosContext);
  if (context === undefined) {
    throw new Error("useDocumentosContext must be used within a DocumentosProvider");
  }
  return context;
};
