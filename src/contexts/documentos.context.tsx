import React, { createContext, useEffect, useMemo, useState, useCallback, useContext } from "react";
import { DocumentosService } from "../services/api/Documenos/documentos.service";
import { ParametrosService } from "../services/api/Parmentros/paramentros.service";
import { ProdutosService } from "../services/api/Produtos/produtos.service";
import { TData } from "../types/TParametros.type";

interface IDocumentosContext {
  parametros: TData | null;
  isLoading: boolean;
  error: any;
  setError: (error: any) => void;
  produtos: any;
  documentos: any;
  createDocument: (data: any) => Promise<any>;
  createDocumentNFE: (documentId: number | null, data: any) => Promise<any>;
  getAllDocuments: () => Promise<any>;
}

const DocumentosContext = createContext<IDocumentosContext | undefined>(undefined);

export const DocumentosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [parametros, setParametros] = useState<TData | null>(null);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);

  const [loading, setLoading] = useState({
    parametros: false,
    produtos: false,
    create: false,
    documentos: false,
  });

  const isLoading = useMemo(
    () => Object.values(loading).some(Boolean),
    [loading]
  );

  const handleError = useCallback((err: any) => {
    console.error(err);
    setError(err);
  }, []);

  const getParametros = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, parametros: true }));
      const response = await ParametrosService.getDataByPage("documentos");
      if (response.success) setParametros(response.data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(prev => ({ ...prev, parametros: false }));
    }
  }, [handleError]);

  const getProdutos = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, produtos: true }));
      const { data } = await ProdutosService.getAll();
      setProdutos(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(prev => ({ ...prev, produtos: false }));
    }
  }, [handleError]);

  const getAllDocuments = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, documentos: true }));
      const { data } = await DocumentosService.getAll();
      setDocumentos(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(prev => ({ ...prev, documentos: false }));
    }
  }, [handleError]);

  const createDocument = useCallback(async (data: any) => {
    try {
      setLoading(prev => ({ ...prev, create: true }));
      const response = await DocumentosService.create(data);
      if (response.success) setDocumentos(prev => [...prev, response.data]);
      else handleError(response.error);
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, create: false }));
    }
  }, [handleError]);

  const createDocumentNFE = useCallback(async (documentId: number | null, data: any) => {
    try {
      setLoading(prev => ({ ...prev, create: true }));

      if(documentId){
        const response = await DocumentosService.createNFE(documentId, data);
        if (response.success) setDocumentos(prev => [...prev, response.data]);
        else handleError(response.error);
      }
      
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, create: false }));
    }
  }, [handleError]);

  useEffect(() => {
    getProdutos();
    getParametros();
    getAllDocuments();
  }, [getProdutos, getParametros, getAllDocuments]);

  return (
    <DocumentosContext.Provider
      value={{
        parametros,
        isLoading,
        error,
        setError: handleError,
        produtos,
        documentos,
        createDocument,
        createDocumentNFE,
        getAllDocuments,
      }}
    >
      {children}
    </DocumentosContext.Provider>
  );
};

export const useDocumentosContext = () => {
  const context = useContext(DocumentosContext);
  if (!context) {
    throw new Error("useDocumentosContext must be used within a DocumentosProvider");
  }
  return context;
};